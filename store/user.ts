// Vuex supports basic typing functionality out of the box
// import type { Context } from '@nuxt/types'

import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'

import { Notification } from 'element-ui'
import { login } from '~/api'
import { getToken, setToken, removeToken } from '~/utils/cookies'
import { userInfo, IUser } from '~/types/user'

@Module({
  name: 'user',
  namespaced: true,
  stateFactory: true,
})
export default class App extends VuexModule {
  public token: string = ''
  public userInfo: userInfo = {}
  public isLogin: boolean = false
  public get username() {
    return this.userInfo.username || ''
  }

  public get avatar() {
    return this.userInfo.avatar || ''
  }

  @Mutation
  private SET_TOKEN(token: string) {
    this.token = token
    setToken(token)
  }

  @Mutation
  private CHANGE_ISLOGIN(isLogin: boolean) {
    this.isLogin = isLogin
  }

  @Mutation
  private SET_USERINFO(userInfo: userInfo) {
    this.userInfo = userInfo
  }

  @Action
  public SetToken() {
    this.SET_TOKEN(getToken() || '')
  }

  @Action
  public ResetToken() {
    removeToken()
    this.SET_TOKEN('')
  }

  @Action
  public async login(loginInfo: IUser) {
    try {
      const res: any = await login(loginInfo)
      console.log(res)
      if (res && res.code === 0) {
        this.SET_TOKEN(res.data.token)
        this.CHANGE_ISLOGIN(true)
        Notification.success({
          title: '成功',
          message: '登录成功！',
        })
      } else {
        this.CHANGE_ISLOGIN(false)
      }
    } catch (error) {}
  }
}
