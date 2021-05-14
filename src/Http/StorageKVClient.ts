import Axios, { AxiosInstance, AxiosResponse } from 'axios'
import { StorageConfig } from './StorageConfig'

const CF_API_URL = 'https://api.cloudflare.com/client/v4/accounts/'

//  https://api.cloudflare.com/#workers-kv-namespace-write-key-value-pair

export class StorageKVClient {
    constructor (
        private config: StorageConfig,
        private httpClient?: AxiosInstance,
    ) {
        if (!httpClient) {
            this.httpClient = Axios.create(this.defaultValues())
        }
    }

    private defaultValues () {
        return {
            timeout: 5000,
            baseURL: `${CF_API_URL}${this.config.accountId}/`,
            headers: { common: { 'X-Auth-Email': this.config.email, 'X-Auth-Key': this.config.key } }
        }
    }

    // public getAllKeys () {
    //     throw Error('@TODO - Implement method. Iterate all Keys')
    // }

    public async get (key: string): Promise<string | null> {
        return this.httpClient.get(`storage/kv/namespaces/${this.config.namespaceId}/values/${key}`)
            .then((response: AxiosResponse) => {
                return response.data
            })
            .catch(() => {
                return null
            })
    }

    public async set (key: string, value: string, ttlSeconds = 86400): Promise<boolean> {
        return this.httpClient.put(`storage/kv/namespaces/${this.config.namespaceId}/values/${key}?expiration_ttl=${ttlSeconds}`, value)
            .then((response: AxiosResponse) => {
                return response.data.success
            })
            .catch(() => {
                return false
            })
    }

    public async delete (key: string): Promise<boolean> {
        return this.httpClient.delete(`storage/kv/namespaces/${this.config.namespaceId}/values/${key}`)
            .then((response: AxiosResponse) => {
                return response.data.success
            })
            .catch(() => {
                return false
            })
    }
}
