const axiosMock = { create: jest.fn(() => jest.fn()), }
jest.mock('axios', () => {return axiosMock})
import { AxiosInstance, AxiosRequestConfig, AxiosStatic } from 'axios'
import { StorageKVClient } from './StorageKVClient'

describe('StorageKVClient', () => {
    let httpClient: AxiosInstance

    const createInstance = () => {
        return new StorageKVClient(
            { accountId: 'accountId', email: 'email', key: 'key', namespaceId: 'namespaceId' },
            httpClient,
        )
    }

    beforeEach(() => {
        httpClient = jest.fn<Partial<AxiosInstance>, any>(() => ({
            get: jest.fn()
                .mockReturnValue(Promise.resolve({ data: 'something' })),
            put: jest.fn()
                .mockReturnValue(Promise.resolve({ data: { 'result': null, 'success': true, 'errors': [], 'messages': [] } })),
            delete: jest.fn()
                .mockReturnValue(Promise.resolve({ data: { 'result': null, 'success': true, 'errors': [], 'messages': [] } })),
        }))() as AxiosInstance
    })

    it('should instanciate an axios client', async (): void => {
        const object = new StorageKVClient(
            { accountId: 'accountId', email: 'email', key: 'key', namespaceId: 'namespaceId' }
        )
        const expectObject = {
            'baseURL': 'https://api.cloudflare.com/client/v4/accounts/accountId/',
            'headers': {
                'common': { 'X-Auth-Email': 'email', 'X-Auth-Key': 'key', },
            }, 'timeout': 5000,
        }

        expect(axiosMock.create).toHaveBeenNthCalledWith(1, expectObject)
    })

    it('should get a Key from CloudFlare only call once the URL', async (): void => {
        const object = createInstance()

        expect(await object.get('this-is-a-key')).toEqual('something')
        expect(httpClient.get).toHaveBeenNthCalledWith(1, 'storage/kv/namespaces/namespaceId/values/this-is-a-key')
        expect(httpClient.get).toHaveBeenCalledTimes(1)
        expect(httpClient.put).not.toHaveBeenCalled()
        expect(httpClient.delete).not.toHaveBeenCalled()
    })

    it('should delete a Key from CloudFlare', async (): void => {
        const object = createInstance()

        expect(await object.delete('this-is-a-key')).toEqual(true)
        expect(httpClient.delete).toHaveBeenNthCalledWith(1, 'storage/kv/namespaces/namespaceId/values/this-is-a-key')
        expect(httpClient.delete).toHaveBeenCalledTimes(1)
        expect(httpClient.get).not.toHaveBeenCalled()
        expect(httpClient.put).not.toHaveBeenCalled()
    })

    it('should set a Key on CloudFlare - default ttl', async (): void => {
        const object = createInstance()

        expect(await object.set('this-is-a-key', 'this is a string')).toEqual(true)
        expect(httpClient.put).toHaveBeenNthCalledWith(1, 'storage/kv/namespaces/namespaceId/values/this-is-a-key?expiration_ttl=86400', 'this is a string')
        expect(httpClient.put).toHaveBeenCalledTimes(1)
        expect(httpClient.get).not.toHaveBeenCalled()
        expect(httpClient.delete).not.toHaveBeenCalled()
    })

    it('should set a Key on CloudFlare', async (): void => {
        const object = createInstance()

        expect(await object.set('this-is-a-key', 'this is a string', 50)).toEqual(true)
        expect(httpClient.put).toHaveBeenNthCalledWith(1, 'storage/kv/namespaces/namespaceId/values/this-is-a-key?expiration_ttl=50', 'this is a string')
        expect(httpClient.put).toHaveBeenCalledTimes(1)
        expect(httpClient.get).not.toHaveBeenCalled()
        expect(httpClient.delete).not.toHaveBeenCalled()
    })

    it('should get a Key from CloudFlare only call once the URL - API error', async (): void => {
        httpClient = jest.fn<Partial<AxiosInstance>, any>(() => ({
            get: jest.fn().mockReturnValue(Promise.reject({ data: new Error() })),
            put: jest.fn(),
            delete: jest.fn(),
        }))() as AxiosInstance

        const object = createInstance()

        expect(await object.get('this-is-a-key')).toEqual(null)
        expect(httpClient.get).toHaveBeenNthCalledWith(1, 'storage/kv/namespaces/namespaceId/values/this-is-a-key')
        expect(httpClient.get).toHaveBeenCalledTimes(1)
        expect(httpClient.put).not.toHaveBeenCalled()
        expect(httpClient.delete).not.toHaveBeenCalled()
    })

    it('should set a Key from CloudFlare only call once the URL - API error', async (): void => {
        httpClient = jest.fn<Partial<AxiosInstance>, any>(() => ({
            put: jest.fn().mockReturnValue(Promise.reject({ data: new Error() })),
            get: jest.fn(),
            delete: jest.fn(),
        }))() as AxiosInstance

        const object = createInstance()

        expect(await object.set('this-is-a-key', 'this is a string')).toEqual(false)
        expect(httpClient.put).toHaveBeenNthCalledWith(1, 'storage/kv/namespaces/namespaceId/values/this-is-a-key?expiration_ttl=86400', 'this is a string')
        expect(httpClient.put).toHaveBeenCalledTimes(1)
        expect(httpClient.get).not.toHaveBeenCalled()
        expect(httpClient.delete).not.toHaveBeenCalled()
    })

    it('should delete a Key from CloudFlare only call once the URL - API error', async (): void => {
        httpClient = jest.fn<Partial<AxiosInstance>, any>(() => ({
            delete: jest.fn().mockReturnValue(Promise.reject({ data: new Error() })),
            put: jest.fn(),
            get: jest.fn(),
        }))() as AxiosInstance

        const object = createInstance()

        expect(await object.delete('this-is-a-key')).toEqual(false)
        expect(httpClient.delete).toHaveBeenNthCalledWith(1, 'storage/kv/namespaces/namespaceId/values/this-is-a-key')
        expect(httpClient.delete).toHaveBeenCalledTimes(1)
        expect(httpClient.get).not.toHaveBeenCalled()
        expect(httpClient.put).not.toHaveBeenCalled()
    })
})
