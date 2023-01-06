import type { ArgsOf, Client } from "discordx";
import { Discord, On } from "discordx";
import { levelupCheck } from "../utils/LevelupChecks.js";
import { db } from '../main.js';


@Discord()
export class VoiceStateHandler {
  /**
   * Get using user id
   */
  private cache = new Map<string, number[][]>();

  /**
   * Gives rewards based on how long a user is unmuted and undeafened in a vc.
   */
  @On({ event: "voiceStateUpdate" })
  async handleVoiceStateUpdate([oldState, newState]: ArgsOf<"voiceStateUpdate">, client: Client): Promise<void> {
    const member = oldState.member!;
    if (member.user.bot) return;
    var timestamps: number[][] = this.cache.get(member.id)!;
    const current_time = Math.round(Date.now() / 1000);

    // change
    if (oldState.channel && newState.channel) {
      // afk
      if (newState.mute || newState.deaf) {
        if (!timestamps) return; // joined before bot online

        timestamps[timestamps.length - 1].push(current_time);
        this.cache.set(member.id, timestamps);
      }
      // back
      else if (oldState.mute || oldState.deaf) {
        if (!timestamps) { // joined before bot online
          this.cache.set(member.id, [[current_time]]);
          return;
        }

        timestamps.push([current_time]);
        this.cache.set(member.id, timestamps);
      }
      return;
    }

    // left
    if (!newState.channel) {
      if (!timestamps) return; // joined before bot online
      // end time
      timestamps[timestamps.length - 1].push(current_time);
      // get total time and reward
      this.cache.delete(member.id);
      var totalTime = 0;

      timestamps.forEach((v) => {
        let diff = v[1] - v[0];
        totalTime += diff;
      });

      var amount = Math.round(totalTime / (60 * 4));
      amount += 5;
      if (amount > 30) amount = 30;

      db.run("UPDATE users SET exp=exp+$amount WHERE id=$id",
        {
          $amount: amount,
          $id: member.id
        },
        (err) => { if (err) throw err; }
      );

      await levelupCheck(db, member);
      return;
    }

    // join
    if (!oldState?.channel) {
      this.cache.set(member.id, [[current_time]]);
      return;
    }
  }
}
