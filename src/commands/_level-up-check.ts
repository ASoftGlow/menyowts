import { CommandInteraction } from "discord.js";
import { Discord, Slash } from "discordx";
import { db } from '../main.js';
import { levelupCheckAll, LevelupCheckStatus } from "../utils/LevelupChecks.js";


@Discord()
export class Example {
  @Slash({
    name: "_level-up-check",
    description: "Admin-only. Level-up checks all members",
    defaultMemberPermissions: "Administrator"
  })
  async manulLevelUpCheck(
    interaction: CommandInteraction
  ): Promise<void> {
    // check all members
    const results = await levelupCheckAll(db, interaction.guild!);

    // process results
    var leveledUp = 0;
    var rankedUp = 0;
    results.forEach((v) => {
      switch (v) {
        case LevelupCheckStatus.LEVELUP:
          leveledUp += 1;
          break;

        case LevelupCheckStatus.RANKUP:
          leveledUp += 1;
          rankedUp += 1;
          break;
      }
    });

    await interaction.reply({
      content: `\`\`\`Checked ${results.length} members.\nLeveled up ${leveledUp}\nRanked up ${rankedUp}\`\`\``,
      ephemeral: true
    });
  }
}
