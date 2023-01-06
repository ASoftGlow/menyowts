import {
  ButtonComponent as _ButtonComponent,
  ButtonInteraction,
  CommandInteraction,
  ComponentType,
  EmbedBuilder,
  GuildMember,
  MessageActionRowComponentBuilder,
} from "discord.js";
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} from "discord.js";
import {
  Discord,
  Slash,
  ButtonComponent
} from "discordx";
import fetch from 'node-fetch';
import pkg from 'he';
const { decode } = pkg;
import { randomElement } from './../utils/RandomElement.js';
import { shuffleArray } from './../utils/ShuffleArray.js';
import { levelupCheck } from '../utils/LevelupChecks.js';
import { authorAvatarOptions } from "../assets/AvatarOptions.js";
import {
  TriviaDifficulty,
  TriviaCategory,
  TriviaQuestion,
  TriviaResponse,
  TriviaData
} from './../assets/TriviaTypes.js';
import { UsersTableRow } from '../assets/DatabaseTypes.js';
import { stringFormatter, db } from './../main.js';
// const rand = require('random-seed').create()


@Discord()
export class Trivia {
  private cache: TriviaQuestion | null = null;
  // TODO: remove timers after some time
  private data = new Map<string, TriviaData>();

  private static readonly maxActiveTrivias = 2;
  private static readonly newQuestionRow = new ActionRowBuilder<MessageActionRowComponentBuilder>()
    .addComponents(
      new ButtonBuilder()
        .setLabel(stringFormatter.format("New", false))
        .setEmoji("❓")
        .setStyle(ButtonStyle.Primary)
        .setCustomId("trivia-new-question")
    );

  static readonly difficulties = new Map<string, TriviaDifficulty>([
    ['easy', { name: 'easy', allotted_time: 8, reward: 2 }],
    ['medium', { name: 'medium', allotted_time: 14, reward: 3 }],
    ['hard', { name: 'hard', allotted_time: 16, reward: 5 }]
  ]);

  static readonly categories = new Map<string, TriviaCategory>([
    ['Random', { id: 0, name: 'Random', color: 3767780 }],
    ['General Knowledge', { id: 9, name: 'General Knowledge', color: 11157727 }],
    ['Entertainment: Books', { id: 10, name: 'Entertainment: Books', color: 14535436 }],
    ['Entertainment: Film', { id: 11, name: 'Entertainment: Film', color: 1763618 }],
    ['Entertainment: Music', { id: 12, name: 'Entertainment: Music', color: 4307366 }],
    ['Entertainment: Musicals & Theatres', { id: 13, name: 'Entertainment: Musicals & Theatres', color: 9006735 }],
    ['Entertainment: Television', { id: 14, name: 'Entertainment: Television', color: 14419191 }],
    ['Entertainment: Video Games', { id: 15, name: 'Entertainment: Video Games', color: 13190716 }],
    ['Entertainment: Board Games', { id: 16, name: 'Entertainment: Board Games', color: 14630908 }],
    ['Science & Nature', { id: 17, name: 'Science & Nature', color: 1856075 }],
    ['Science: Computers', { id: 18, name: 'Science: Computers', color: 12352986 }],
    ['Science: Mathematics', { id: 19, name: 'Science: Mathematics', color: 4550918 }],
    ['Mythology', { id: 20, name: 'Mythology', color: 13488885 }],
    ['Sports', { id: 21, name: 'Sports', color: 3101279 }],
    ['Geography', { id: 22, name: 'Geography', color: 10208194 }],
    ['History', { id: 23, name: 'History', color: 8275726 }],
    ['Art', { id: 25, name: 'Art', color: 4016931 }],
    ['Animals', { id: 27, name: 'Animals', color: 14933380 }],
    ['Vehicles', { id: 28, name: 'Vehicles', color: 15845749 }],
    ['Entertainment: Comics', { id: 29, name: 'Entertainment: Comics', color: 5512042 }],
    ['Science: Gadgets', { id: 30, name: 'Science: Gadgets', color: 10249156 }],
    ['Entertainment: Japanese Anime & Manga', { id: 31, name: 'Entertainment: Japanese Anime & Manga', color: 5501722 }],
    ['Entertainment: Cartoon & Animations', { id: 32, name: 'Entertainment: Cartoon & Animations', color: 8120042 }],
  ]);

  static async request(): Promise<TriviaQuestion | null> {
    const category: TriviaCategory = randomElement(Array.from(Trivia.categories.values()));
    const res = await fetch(`https://opentdb.com/api.php?amount=1&category=${category.id}`);
    // idk what is going on here but it works
    const _json: any = await res.json();
    const json: TriviaResponse = _json;

    if (json.response_code !== 0) {
      console.log('Trivia request failed: ' + json.response_code);
      return null;
    }
    const rawQ = json.results[0];
    return {
      category: Trivia.categories.get(rawQ.category)!,
      difficulty: Trivia.difficulties.get(rawQ.difficulty)!,
      text: decode(rawQ.question),
      correct_answer: decode(rawQ.correct_answer),
      incorrect_answers: rawQ.incorrect_answers.map((v, i, a) => { return decode(v); })
    };
  }

  async sendQuestion(interaction: CommandInteraction | ButtonInteraction) {
    const isCommand = interaction instanceof CommandInteraction;
    const sendReply = isCommand ?
      interaction.followUp.bind(interaction) :
      interaction.editReply.bind(interaction);

    isCommand ? await interaction.deferReply() : await interaction.deferUpdate();

    if (this.cache !== null) {
      var question = this.cache;
      this.cache = null;
    }
    else {
      const _response = await Trivia.request();
      if (_response === null) {
        await sendReply('Trivia request failed.');
        return;
      }
      var question = _response;
    }

    const triviaEmbed = new EmbedBuilder()
      .setTitle(stringFormatter.format(`Trivia Question   ∙   ${question.difficulty.name}`, false))
      .setDescription(stringFormatter.format(question.text))
      .setColor(question.category.color)
      .setFooter({ text: stringFormatter.format(`You have ${question.difficulty.allotted_time} seconds to answer`) });

    var answerBtns: ButtonBuilder[] = [];
    answerBtns.push(
      new ButtonBuilder()
        .setLabel(stringFormatter.format(question.correct_answer, false))
        .setStyle(ButtonStyle.Secondary)
        .setCustomId('trivia-correct')
        .setDisabled(true)
    );
    question.incorrect_answers.forEach((b) => {
      answerBtns.push(
        new ButtonBuilder()
          .setLabel(stringFormatter.format(b, false))
          .setStyle(ButtonStyle.Secondary)
          .setCustomId('trivia-incorrect-' + answerBtns.length)
          .setDisabled(true)
      );
    });
    shuffleArray(answerBtns);

    const row = new ActionRowBuilder<MessageActionRowComponentBuilder>()
      .addComponents(answerBtns);

    await sendReply({
      content: isCommand ? undefined : null!,
      embeds: [triviaEmbed],
      components: [row]
    })
      .then((msg) => {
        this.data.set(msg.id, {
          question: question,
          embed: triviaEmbed,
          row: row,
          timeout: setTimeout(async () => {
            // if (msg.embeds[0].footer?.iconURL) return;
            const embed = EmbedBuilder.from(msg.embeds[0])
              .setFooter({
                iconURL: undefined,
                text: 'Time has run out'
              });

            row.setComponents(
              msg.components[0].components.map((v, i, a) => {
                if (v.type !== ComponentType.Button) throw new Error();
                return ButtonBuilder.from(v)
                  .setDisabled(true);
              })
            );

            msg.edit({
              embeds: [embed],
              components: [
                row,
                Trivia.newQuestionRow
              ]
            });
          }, question.difficulty.allotted_time * 1000 + 1500)
        });

        // read delay
        setTimeout(() => {
          row.components.forEach(i => {
            i.setDisabled(false);
          });
          msg.edit({
            components: [row]
          });
        }, 1500);
      });

    // refill cache
    if (this.cache === null) {
      (async () => {
        this.cache = await Trivia.request();
      })();
    }
  }


  @Slash({ description: "Sends a trivia question", name: "trivia" })
  async trivia(
    interaction: CommandInteraction
  ): Promise<void> {
    // if (this.timers.size >= Trivia.maxActiveTrivias) {
    //   // remove first
    //   const first_key: string = Array.from(this.timers.keys())[0]!
    //   clearTimeout(this.timers.get(first_key))
    //   this.timers.delete(first_key)
    // }
    
    await this.sendQuestion(interaction);
  };


  @ButtonComponent({ id: /trivia-(correct|incorrect-\d+)/ })
  async answerBtnsHandler(interaction: ButtonInteraction) {
    // console.log(interaction.customId, interaction.member?.user.username);
    const data = this.data.get(interaction.message.id)!;
    // cancel timeout
    clearTimeout(data.timeout);
    // embed
    if (!(interaction.member instanceof GuildMember)) return;
    const member: GuildMember = interaction.member;
    const timeDiff: number = Date.now() - interaction.createdTimestamp;
    data.embed.setFooter({
      text: stringFormatter.format(`Answered by `, false) + member.displayName + stringFormatter.format(` in ${timeDiff}`, false),
      iconURL: member.displayAvatarURL(authorAvatarOptions)
    });


    var streak = 0;
    // rewards
    if (interaction.customId === 'trivia-correct') {
      db.run("UPDATE users SET coins=coins+$coins, exp=exp+$exp, correct_trivia=correct_trivia+1, trivia_streak=trivia_streak+1 WHERE id=$id",
        {
          $coins: data.question.difficulty.reward,
          $exp: Math.round(data.question.difficulty.reward / 2),
          $id: interaction.user.id
        },
        function (err) { if (err) throw err; })
        .get("SELECT trivia_streak FROM users WHERE id=?", [interaction.user.id], (err: Error, row: UsersTableRow) => {
          if (err) throw err;
          streak = row.trivia_streak;
        });

      await levelupCheck(db, (interaction.member as GuildMember));
    }
    else {
      db.run("UPDATE users SET incorrect_trivia=incorrect_trivia+1, trivia_streak=0 WHERE id=?", [interaction.user.id]);
    }


    // btns
    var triviaBtns: ButtonBuilder[] = [];

    interaction.message.components[0].components.forEach(i => {
      if (i.type == ComponentType.Button) {
        let btn = ButtonBuilder.from(i);

        if (i.customId === 'trivia-correct') {
          btn.setStyle(ButtonStyle.Success);
        }
        if (i.customId === interaction.customId && i.customId.startsWith('trivia-incorrect')) {
          btn.setStyle(ButtonStyle.Danger);
        }
        btn.setDisabled(true);

        triviaBtns.push(btn);
      }
    });

    const answersRow = new ActionRowBuilder<MessageActionRowComponentBuilder>()
      .addComponents(triviaBtns);

    await interaction.update({
      content: `🔥 ${streak}`,
      embeds: [data.embed],
      components: [
        answersRow,
        Trivia.newQuestionRow
      ]
    });
  }


  @ButtonComponent({ id: "trivia-new-question" })
  async newQuestionBtnHandler(interaction: ButtonInteraction): Promise<void> {
    await this.sendQuestion(interaction);
  }
}