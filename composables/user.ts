export const useUser = () => {
  return useState<User | null>('user', () => null)
}