export type UsersTableType = {
  /**
   * Discord ID 
   */
  id: string;
  coins: number;
  /**
   * Number of Discord messages sent 
   */
  message_count: number;
  level: number;
  /**Experience */
  exp: number;
  /**
   * ID of job
   * @deprecated
   */
  job_id: number;
  /**ID of rank */
  rank: number;
  warnings: number;
  daily_cooldown: number;
  weekly_cooldown: number;
  job_task_cooldown: number;
  new_job_cooldown: number;
  correct_trivia: number;
  incorrect_trivia: number;
  threads: number;
  trivia_streak: number;
};

export type ItemsTableType = {
  id: number
  /**
   * Discord id
   */
  user_id: string
  /**
   * Item type id
   */
  item_id: string
  /**
   * If item is enabled; for example, roles.
   */
  enabled: boolean
}

