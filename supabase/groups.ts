import { tables } from "@/constants"
import { groupMemberT, groupT, withoutIdT } from "@/types"
import { sendSMS } from "@/utils"
import { groupMembersSchema, groupsSchema, usersSchema } from "@/zodSchema"
import { z } from "zod"
import { supabase } from "."
import { getUserByPhone } from "./users"

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
        console.log(membersRes.data);
        
        const members = groupMembersJoinedSchema.array().parse(membersRes.data)
        myGroups[group.group_id] = members
        membersRes.error && errors.push(membersRes.error)
    }
}

return {data:myGroups, errors}
}

export async function createGroup(group:withoutIdT<groupT>) {
    return await groupsTableRef.insert(group)
}

export async function createGroupMember(groupMember:withoutIdT<groupMemberT> & {
    phone:number
}) {
    const {phone, ...rest} = groupMember
    const user = await getUserByPhone(phone)
    if (user.data && !Array.isArray(user.data)) {
        groupMember.member_id = user.data.id
    }
    else{
        delete groupMember.member_id
    }
    const res = await groupMembersTableRef.insert(rest).select()
    sendSMS({message:"", phone})
    return res
}

export async function acceptGroupInvite({parsedToken}:{parsedToken:{phone:number, membership_id:number}}) {
    const user =await supabase.auth.getUser()
    if (user.data && parsedToken.phone.toString() === user.data.user?.phone) {
        const member:Partial<groupMemberT> = {member_id: user.data.user.id, invitation_accepted:true}
        groupMembersTableRef.update(member).eq("id", parsedToken.membership_id)
    }
}