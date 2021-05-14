## Get , Set , Delete data in Cloudflare Storage
A easy to use javascript (Typescript) client to communicate cloudflare KV and Axios

#### Minimum usage Configuration
```JS
import { StorageKVClient } from 'cloudflare-storage-kv'

// Set the instance
const storage = new StorageKVClient(
    { accountId: 'accountId', email: 'email', key: 'key', namespaceId: 'namespaceId' },
)


const start = async () => {
    // set item in namespace, return a boolean
    const res = await storage.set('test', 'data-inside')
    
    // get item in namespace, return a string
    const retrieve = await storage.get('test')
    console.log(retrieve)
    
    // delete item in namespace, return a boolean
    const res = await storage.delete('test')
}

start()
```
