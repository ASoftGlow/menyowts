import type { CommandInteraction } from "discord.js";
import { Discord, Slash } from "discordx";
import { TimeFormatter } from '../utils/TimeFormatter.js';
import {db} from '../main.js'


@Discord()
export class Example {
  @Slash({ name: "_stop", description: "Admin-only; destroys client" })
  async stop(
    interaction: CommandInteraction
  ): Promise<void> {
    await interaction.reply({
      content: 'Stopping after ' + TimeFormatter.parseMilliseconds(interaction.client.uptime),
      ephemeral: true
    });

    db.close()
    interaction.client.destroy();
    process.exitCode = 0;
  }
}
