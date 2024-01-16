
export const PROFILE_ACTION_TYPE = {
  updateProfile: 'UPDATE_PROFILE',
  updateAvatar: 'UPDATE_AVATAR'
} as const

export const profileReducer = <T extends object>(
  state: T, 
  {type, payload}: {
    type: typeof PROFILE_ACTION_TYPE[
      keyof typeof PROFILE_ACTION_TYPE
    ]
    payload: { name: string, value: T[keyof T]}
  }
): T => 
{
  switch(type) {
    case PROFILE_ACTION_TYPE.updateProfile:
      return {
        ...state,
        [payload.name]: payload.value,
      }
    default:
      return state;
  }
}
