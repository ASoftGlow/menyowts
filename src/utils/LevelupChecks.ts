import {
  GuildMember,
  TextChannel,
  ChannelType,
  userMention
} from 'discord.js';
import { Database } from 'sqlite3';
import { UsersTableRow } from '../assets/DatabaseTypes.js';
import { Rank, ranks } from '../assets/Ranks.js';


export function getRank(level: number): Rank | undefined {
  return ranks.get(Math.floor(level / 3));
}

async function upgradeRank(db: Database, member: GuildMember, oldRank: Rank, newRank: Rank, quiet: boolean = false): Promise<void> {
  db.run("UPDATE users SET rank=$rank WHERE id=$id",
    { $rank: newRank, $id: member.id },
    (err: Error | null) => { if (err) throw err; });

  let role = member.guild.roles.cache.get(newRank.name)!;
  await member.roles.add(role, "Rankup");

  role = member.guild.roles.cache.get(oldRank.name)!;
  await member.roles.remove(role, "Rankup");

  if (!quiet) {
    const _channel = member.guild.channels.cache.get("832283357323984917")!;
    if (_channel.type !== ChannelType.GuildText) return;
    const showAndTellChannel: TextChannel = _channel;
    await showAndTellChannel.send(`${userMention(member.id)} has ranked up to ${newRank.name}!`);
  }
  else {
    console.log(`${member.user.username} ranked up to ${newRank.name}`);
  }
}


export async function levelupCheck(db: Database, member: GuildMember) {
  if (member.user.bot) return;

  db.get("SELECT level, exp FROM users WHERE id=?", [member.id], async (err: Error | null, row: UsersTableRow) => {
    if (err) throw err;
    const level_goal = 100 * row.level + 100;

    if (row.exp >= level_goal) {
      db.run("UPDATE users SET exp=exp+$amount, level=level+1 WHERE id=$id",
        {
          $amount: -level_goal,
          $id: member.id
        },
        (err: Error | null) => { if (err) throw err; });
      row.level += 1;

      // rank up
      if (row.level % 3 === 0 && row.level > 0 && row.level / 3 <= ranks.size - 1) {
        const newRank = getRank(row.level)!;
        const oldRank = getRank(row.level - 1)!;

        await upgradeRank(db, member, oldRank, newRank);
      }
    }
  });
}