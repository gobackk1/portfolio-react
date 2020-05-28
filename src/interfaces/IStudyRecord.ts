export default interface IStudyRecord {
  id: number
  comments: any[]
  date: string
  record_comment: any
  created_at: string
  image_url: string
  study_genre_list: string[]
  study_hours: number
  teaching_material_id: number | null
  teaching_material_name: string
  updated_at: string
  user_id: number
  user: {
    id: number
    image_url: string
    name: string
  }
}
