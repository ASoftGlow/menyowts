import type { CommandInteraction } from "discord.js";
import { ApplicationCommandOptionType } from "discord.js";
import { Discord, Slash, SlashChoice, SlashOption } from "discordx";
import { FormatterMode } from '../utils/StringFormatter.js';
import { stringFormatter } from '../main.js';


function handleModeParameter(mode: string): FormatterMode {
  switch (mode) {
    case "owo":
      return FormatterMode.owo;
    case "lolcat":
      return FormatterMode.lolcat;
    case "owo":
      return FormatterMode.owo;
    case "sarcastic":
      return FormatterMode.sarcastic;
    default:
      return FormatterMode.normal;
  }
}

@Discord()
export class Mode {
  @Slash({ name: "mode", description: "Sets the mode of the text formatter" })
  mode(
    @SlashChoice("normal", "owo", "lolcat", "sarcastic")
    @SlashOption({
      description: "Choose an option",
      name: "mode",
      required: true,
      type: ApplicationCommandOptionType.String
    })
    _mode: string,
    interaction: CommandInteraction
  ): void {
    const mode = handleModeParameter(_mode);

    stringFormatter.mode = mode;

    interaction.reply(stringFormatter.format(`Changed text format mode to ${_mode}`));
  }
}
