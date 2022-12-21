export type UsersTableRow = {
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

export type ItemsTableRow = {
  id: number;
  /**
   * Discord id
   */
  user_id: string;
  /**
   * Item type id
   */
  item_id: string;
  /**
   * If item is enabled; for example, roles.
   */
  enabled: boolean;
};

export type PetsTableRow = {
  pet_id: number;
  /**
   * Discord id
   */
  owner_id: string;
  name: string;
  price: number;
  health: number;
  hunger: number;
  age: number;
  happiness: number;
  gender: "male" | "female"
  long_tail: boolean;
  long_face: boolean;
  eyes_offset: number;
  eye_type: number;
  left_ear_height: number;
  right_ear_height: number;
  pattern: number;
  pattern_transformation: number;
  nose_color: number;
  ear_color: number;
  main_fur_color: number;
  sub_fur_color: number;
  colorpoint_color: number;
  left_eye_color: number;
  right_eye_color: number;
  /**
   * URL of image (cdn.discordapp.com)
   */
  b1_img: string;
  /**
   * URL of image (cdn.discordapp.com)
   */
  b2_img: string;
  /**
   * URL of image (cdn.discordapp.com)
   */
  b3_img: string;
};