import TError from '@/types/TError'
export default class CustomError extends Error {
  constructor(public message: string, public type: TError) {
    super(message)
    this.type = type
  }
}
