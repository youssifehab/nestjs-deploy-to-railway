export interface Payload {
  userId: number;
  email: string;
  artistId?: number;
}

export type Enable2FAType = {
  secret: string;
};
