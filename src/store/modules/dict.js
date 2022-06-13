import {getDicts} from "../../api/system/dict/data";
import {Observable} from "rxjs";

let SUBSCRIBE_MAP = []

const useDictionaryStore = defineStore(
    'dictionary',
    {
        state: () => ({
            data: {},
        }),
        actions: {
            setData(type, data) {
                console.log(type, data)
                this.data[type] = data
            },
            getData(type) {
                return new Observable((subscriber) => {
                    console.log(subscriber)
                    if (this.data[type]) {
                        subscriber.next(this.data[type])
                    } else {
                        if (!SUBSCRIBE_MAP.some(item => item.type === type)) {
                            this.queryData(type)
                        }

                        SUBSCRIBE_MAP.push({
                            type,
                            next: (value) => subscriber.next(value),
                            complete: () => subscriber.complete(),
                        })
                    }
                })
            },
            async queryData(type) {
                const resp = await getDicts(type)
                if (resp.code === 200) {
                    const dictArray = resp.data.map(item => ({
                        dictCode: item.dictCode,
                        dictLabel: item.dictLabel,
                        dictType: item.dictType,
                        status: item.status,
                        dictValue: item.dictValue
                    }))
                    SUBSCRIBE_MAP = SUBSCRIBE_MAP.filter(item => {
                        if (item.type === type) {
                            item.next(dictArray)
                            return false
                        }
                        return true
                    })
                    this.setData( type, dictArray )
                }
            }
        }
    }
)

export default useDictionaryStore