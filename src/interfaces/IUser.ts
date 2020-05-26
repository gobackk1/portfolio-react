export default interface IUser {
  id: number
  user_bio: string
  image_url: string
  name: string
  registered_date: string
  total_study_hours: number
  followings_count: number
  followers_count: number
  is_following: boolean
}
