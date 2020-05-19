import TError from '@/types/TError'
export default interface ICustomError extends Error {
  type: TError
}
