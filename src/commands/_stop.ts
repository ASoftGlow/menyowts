import { CommandInteraction, time, TimestampStyles } from "discord.js";
import { Discord, Slash } from "discordx";
import { TimeFormatter } from '../utils/TimeFormatter.js';
import {db} from '../main.js'


@Discord()
export class Example {
  @Slash({ 
    name: "_stop", 
    description: "Admin-only; destroys client",
    defaultMemberPermissions: "Administrator"
  })
  async stop(
    interaction: CommandInteraction
  ): Promise<void> {
    await interaction.reply({
      content: 'Stopping after ' + time(Math.floor((Date.now()-interaction.client.uptime)/1000), TimestampStyles.RelativeTime),
      ephemeral: true
    });

    db.close()
    interaction.client.destroy();
    process.exitCode = 0;
  }
}
