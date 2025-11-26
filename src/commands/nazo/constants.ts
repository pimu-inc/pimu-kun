export const PUZZLE_URL =
  'https://www.figma.com/design/Wd33RqlORIvHl6AXZrXL0G/discord-bot?node-id=0-1&p=f&t=2OyQmccK2zjTnQEh-0';

// Base64 encoded values for obfuscation
const ENCODED_REWARD_URL =
  'aHR0cHM6Ly9tZW1vcmVlZWwuY29tL3JlY2VpdmVycy9tZXNzYWdlLWJvYXJkcy85MTBlZWEwOTI1YTM0NTQ4MDFkMmU4ZTFjNTZi';
const ENCODED_FIRST_FLAG = 'NmY5Ng==';
const ENCODED_SECOND_FLAG = 'MmVkOA==';

export const FIRST_ANSWER_HASH = 'f2c6ebac53ad661c3d317357f9c9edcb502392519fb6ce229681b13f9b2e3c7a';
export const SECOND_ANSWER_HASH = '580120495368d0e6e800a25aeb759882a21fd8ab7897b030b97a091bac1eaa03';

export const getRewardUrl = (): string => atob(ENCODED_REWARD_URL);
export const getFirstFlag = (): string => atob(ENCODED_FIRST_FLAG);
export const getSecondFlag = (): string => atob(ENCODED_SECOND_FLAG);
