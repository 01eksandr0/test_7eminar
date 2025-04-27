import { getComments, initializeComments } from '../../utils/db'

const handler = defineEventHandler(async (req) => {
    const { id } = getQuery(req)
    await initializeComments()
    return await getComments(Number(id))
})

export default handler
