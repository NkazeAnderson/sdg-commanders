import { PostgrestSingleResponse } from "@supabase/supabase-js";
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { z, ZodTypeAny } from "zod";

export const hookFormErrorHandler = (error: any) => {
    console.log(error)
}

export const unknownErrorHandler = (error: any) => {
    console.log(error)
}

export const parseDatabaseResponse = <T extends ZodTypeAny>(res: PostgrestSingleResponse<any>|PostgrestSingleResponse<any[]>, schema:T) => {
    try {
        const { data, error } = res;
        if (error){
            return {data: null, error};
        }
        else if (Array.isArray(data)) {
            return {data:schema.array().parse(data) as z.infer<typeof schema>[], error};
        }
        else{
            return {data:schema.parse(data) as z.infer<typeof schema>, error};
        }
    } catch (error) {
        console.error("Data parsing error:", error);
        return { data: null, error };
    }
}

export const requestLocationPermission = async (): Promise<boolean> => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    return status === 'granted';
};

export const getUserLocation = async (): Promise<Location.LocationObject | null> => {
    const hasPermission = await requestLocationPermission();
    if (!hasPermission) {
        return null;
    }
    return await Location.getCurrentPositionAsync();
};

// export const getProfilePicture = (user:userT):ImageSourcePropType=>{
//  return user?.profile_picture ? {uri:user.profile_picture}: face
// }

export const sendSMS = (data: {message:string, phone:number})=>{
    console.log("Message sent");
}

export const getImageFromGallery = async ()=>{
    const {granted}  = await ImagePicker.getMediaLibraryPermissionsAsync()
    console.log(granted);
    
    if (!granted) {
        const permission = await ImagePicker.requestMediaLibraryPermissionsAsync()
        if (!permission.granted) {
            return null
        }
    }
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      aspect: [4, 3]
    });
    return result.assets ? result.assets[0] : null
}

export const getDistanceInMeters = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
): number => {
    const toRad = (value: number) => (value * Math.PI) / 180;
    const R = 6371000; // Earth's radius in meters
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) *
            Math.cos(toRad(lat2)) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
};                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               