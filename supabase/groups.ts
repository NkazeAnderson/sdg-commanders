import { tables } from "@/constants"
import { groupMemberT, groupT, withoutIdT } from "@/types"
import { parseDatabaseResponse, sendSMS } from "@/utils"
import { groupMembersSchema, groupsSchema, usersSchema } from "@/zodSchema"
import { z } from "zod"
import { supabase } from "."

const groupsTableRef = supabase.from(tables.groups)
const groupMembersTableRef = supabase.from(tables.group_members)

export const groupMembersJoinedSchema = groupMembersSchema.extend({group_id:groupsSchema, member_id:usersSchema.optional()})
export type groupMembersJoinedSchemaT = z.infer<typeof groupMembersJoinedSchema>

export const getMyGroups = async (id:string)=>{
const groupsRes = await groupMembersTableRef.select("group_id").eq("member_id", id)
const myGroups:Record<string, groupMembersJoinedSchemaT[]> ={}
const errors = [groupsRes.error]
if (groupsRes.data) {
    const groups = groupMembersSchema.pick({group_id:true}).array().parse(groupsRes.data)
    
    for(let group of groups) {
        const membersRes = await groupMembersTableRef.select("*, group_id (*), member_id (*)").eq("group_id", group.group_id)
        const members = groupMembersJoinedSchema.array().parse(membersRes.data)
        myGroups[group.group_id] = members
        membersRes.error && errors.push(membersRes.error)
    }
}

return {data:myGroups, errors}
}
export async function getGroupMember(membershipId:string) {
    const membersRes = await groupMembersTableRef.select("*, group_id (*), member_id (*)").eq("id", membershipId).single()
    return parseDatabaseResponse(membersRes, groupMembersJoinedSchema)
}

export async function createGroup(group:withoutIdT<groupT>) {
    return await groupsTableRef.insert(group)
}

export async function createGroupMember(groupMember:withoutIdT<groupMemberT> & {
    phone:number
}) {
    const {phone, ...rest} = groupMember
    const res = await groupMembersTableRef.insert(rest).select().single()
    res.data?.id && sendSMS({message:`You have been invited to join a family on SGK Commanders. Follow this link to accept: sgkcommanders://index?phone=${phone}&memberId=${res.data.id}`, phone})
    return res
}

export async function acceptGroupInvite(userId:string, membership_id:string) {
        const member:Partial<groupMemberT> = {member_id: userId, invitation_accepted:true}
       const res = await groupMembersTableRef.update(member).eq("id", membership_id)
       return res
}