import {
  GuildMember,
  TextChannel,
  ChannelType,
  userMention,
  Guild
} from 'discord.js';
import { Database } from 'sqlite3';
import { UsersTableRow } from '../assets/DatabaseTypes.js';
import { Rank, ranks } from '../assets/Ranks.js';
import { stringFormatter } from '../main.js';


export function getRank(level: number): Rank | undefined {
  return ranks.get(Math.floor(level / 3));
}

async function upgradeRank(db: Database, member: GuildMember, oldRank: Rank, newRank: Rank, quiet: boolean = false): Promise<void> {
  db.run("UPDATE users SET rank=$rank WHERE id=$id",
    { $rank: newRank.id, $id: member.id },
    (err: Error | null) => { if (err) throw err; });

  let role = member.guild.roles.cache.get(newRank.roleID)!;
  await member.roles.add(role, "Rankup");

  role = member.guild.roles.cache.get(oldRank.roleID)!;
  await member.roles.remove(role, "Rankup");

  if (!quiet) {
    const _channel = member.guild.channels.cache.get("832283357323984917")!;
    if (_channel.type !== ChannelType.GuildText) return;
    const showAndTellChannel: TextChannel = _channel;
    await showAndTellChannel.send(stringFormatter.formatD(`${userMention(member.id)} has ranked up to ${newRank.name}!`));
  }
  else {
    console.log(`${member.user.username} ranked up to ${newRank.name}`);
  }
}


export enum LevelupCheckStatus {
  NO_CHANGE,
  LEVELUP,
  RANKUP
}

export async function levelupCheck(db: Database, member: GuildMember): Promise<LevelupCheckStatus | null> {
  if (member.user.bot) return null;

  return new Promise((resolve, reject) => {
    db.get("SELECT level, exp FROM users WHERE id=?", [member.id], async (err: Error | null, row: UsersTableRow) => {
      if (err) throw err;
      const level_goal = 100 * (row.level + 1);

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
          resolve(LevelupCheckStatus.RANKUP);
        }
        else {
          resolve(LevelupCheckStatus.LEVELUP);
        }
      } else {
        resolve(LevelupCheckStatus.NO_CHANGE);
      }
    });
  });
}

export async function levelupCheckAll(db: Database, guild: Guild): Promise<LevelupCheckStatus[]> {
  return new Promise((resolve, reject) => {

    db.all("SELECT id, level, exp FROM users", async (err: Error | null, rows: UsersTableRow[]) => {
      if (err) throw err;
      
      // cache all members
      await guild.members.fetch()

      resolve(Promise.all(rows.map(async (row) => {
        const level_goal = 100 * (row.level + 1);

        if (row.exp >= level_goal) {
          db.run("UPDATE users SET exp=exp+$amount, level=level+1 WHERE id=$id",
            {
              $amount: -level_goal,
              $id: row.id
            },
            (err: Error | null) => { if (err) throw err; });
          row.level += 1;

          // rank up
          if (row.level % 3 === 0 && row.level > 0 && row.level / 3 <= ranks.size - 1) {
            const newRank = getRank(row.level)!;
            const oldRank = getRank(row.level - 1)!;
            const member = guild.members.cache.get(row.id)!;
            // const member = await guild.members.fetch({ user: row.id });

            await upgradeRank(db, member, oldRank, newRank);
            return LevelupCheckStatus.RANKUP;
          }
          else {
            return LevelupCheckStatus.LEVELUP;
          }
        } else {
          return LevelupCheckStatus.NO_CHANGE;
        }
      })));
    });
  });
}