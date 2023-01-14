import type { ArgsOf, Client } from "discordx";
import { Discord, On } from "discordx";
import { UsersTableRow } from "../assets/DatabaseTypes.js";
import { db } from "../main.js";
import { levelupCheck } from "../utils/LevelupChecks.js";


@Discord()
export class Example {
  @On({ event: "threadCreate" })
  async handleThreadCreate([thread, isNew]: ArgsOf<"threadCreate">, client: Client): Promise<void> {
    if (thread.joined || !isNew) return;

    thread.join();

    if ((await thread.fetchOwner())?.guildMember?.permissions.has("Administrator")) return;

    db.run("UPDATE users SET threads=threads-1, exp=exp+20 WHERE id=?",
      [thread.ownerId],
      async (err: Error | null) => {
        if (err) throw err;
        await levelupCheck(db, thread.guildMembers.get(thread.ownerId!)!)

        db.get("SELECT threads FROM users WHERE id=?",
          [thread.ownerId],
          async (err: Error | null, row: UsersTableRow) => {
            if (err) throw err;

            if (row.threads <= 0) {
              // Weaver 955226254964056134;
              const owner = (await thread.fetchOwner())?.guildMember!;
              const role = owner.roles.cache.get("955226254964056134");

              if (!role) return;
              await owner.roles.remove(
                role,
                'Ran out of Threads'
              );
            }
          });
      });
  }
}
