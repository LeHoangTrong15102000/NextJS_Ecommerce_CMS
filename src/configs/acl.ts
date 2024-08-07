import { AbilityBuilder, Ability } from '@casl/ability'
import { PERMISSIONS } from 'src/configs/permission'

export type Subjects = string
export type Actions = 'manage' | 'create' | 'read' | 'update' | 'delete'

export type AppAbility = Ability<[Actions, Subjects]> | undefined

export const AppAbility = Ability as any
export type ACLObj = {
  action: Actions
  subject: string
}

/**
 * Please define your own Ability rules according to your app requirements.
 * We have just shown Admin and Client rules for demo purpose where
 * admin can manage everything and client can just visit ACL page
 */
const defineRulesFor = (permissionUser: string[], permission?: string[]) => {
  const { can, rules } = new AbilityBuilder(AppAbility)

  // if (permission === 'admin') {
  //   can('manage', 'all')
  // } else if (permission === 'client') {
  //   can(['read'], 'acl-page')
  // } else {
  //   // Permission còn lại thì có quyền read create update và delete với subject sẽ được đưa ra chi tiết
  //   can(['read', 'create', 'update', 'delete'], subject)
  // }

  // Hàm includes vẫn dùng để check trong phần tử của Array
  if (
    !permission?.length ||
    permissionUser.includes(PERMISSIONS.ADMIN) ||
    // Thì ở đây chỉ mới là có quyền VIEW trước thôi rồi khi vào mainPage thì ở đây là mới check CREATE UPDATE DELETE
    permission.every((item) => permissionUser.includes(item))
  ) {
    can('manage', 'all')
  }

  return rules
}

export const buildAbilityFor = (permissionUser: string[], permission?: string[]): AppAbility => {
  return new AppAbility(defineRulesFor(permissionUser, permission), {
    // https://casl.js.org/v5/en/guide/subject-type-detection
    // @ts-ignore
    detectSubjectType: (object) => object!.type
  })
}

export const defaultACLObj: ACLObj = {
  action: 'manage',
  subject: 'all'
}

export default defineRulesFor
