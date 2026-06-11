export type Profile = {
  id: string;
  name: string;
  birthday: string; // 'YYYY-MM-DD'
  registeredBy: string;
  createdAt: number;
};

// private_metadata でモーダル間を引き継ぐ情報
export type UranaiMetadata = {
  channelId: string;
};
