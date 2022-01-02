import IpfsClient from "ipfs-http-client"
export const client = IpfsClient({
     host: "ipfs.infura.io", port:5001, protocol:"https"
})

export const getIpfsHash = async (file) => {
    const upload = await client.add(file.stream())
    return upload.path
}

const baseURL = "https://ipfs.io/ipfs/"

export const getIpfsURL = (hash) => {
    return `${baseURL}${hash}`
}