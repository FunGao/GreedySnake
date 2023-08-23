import { sys } from "cc"

export class UserLocalData {

    public static UserData = {}

    static init() {
        let localData = sys.localStorage.getItem('userData')
        UserLocalData.UserData = localData ? { ...JSON.parse(sys.localStorage.getItem('userData')) } : {}
    }

    static setData(name: string, value: any) {
        UserLocalData.UserData[name] = value
        this.updateData()
    }

    static getData(name: string) {
        return UserLocalData.UserData[name]
    }

    static updateData() {
        sys.localStorage.setItem('userData', JSON.stringify(UserLocalData.UserData))
    }
}

