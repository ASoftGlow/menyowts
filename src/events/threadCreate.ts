import type { ArgsOf, Client } from "discordx";
import { Discord, On } from "discordx";
import { UsersTableRow } from "../assets/DatabaseTypes.js";
import { db } from "../main.js";


@Discord()
export class Example {
  @On({ event: "threadCreate" })
  handleThreadCreate([thread, isNew]: ArgsOf<"threadCreate">, client: Client): void {
    if (thread.joined || !isNew) return;

    thread.join();

    db.run("UPDATE users SET threads=threads-1 WHERE id=?",
      [thread.ownerId],
      (err: Error | null) => {
        if (err) throw err;

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
