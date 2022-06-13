import {listData} from '@/api/system/dict/data'
import {getDicts} from "../../api/system/dict/data";

export const useDictionaryStore = defineStore(
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
            async getData(type) {
                console.log(this.data[type])
                if (this.data[type]) {
                    return this.data[type]
                } else {
                    await this.queryData(type)
                    return this.getData(type)
                }
            },
            async queryData(type) {
                const resp = await getDicts(type)
                if (resp.code === 200) {
                    this.setData(
                        type,
                        resp.data.map(item => ({
                            dictCode: item.dictCode,
                            dictLabel: item.dictLabel,
                            dictType: item.dictType,
                            status: item.status,
                            dictValue: item.dictValue
                        }))
                    )
                }
            }
        }
    }
)