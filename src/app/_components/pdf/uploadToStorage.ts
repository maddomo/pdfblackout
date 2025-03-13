import { createClient } from "~/supabase/client";
import { extractFromPDF } from "~/utils/findPersonalInformation";
const supabase = createClient();


export const uploadToStorage = async (file: File, whiteList: string[] = []) => {
  

    const user = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error("User is not authenticated.");
    }

    try{
      
      const redactedPDF = await extractFromPDF(file, whiteList);
      console.log(redactedPDF);

      const folderpath = `${user.data.user?.id}/${file.name}`;

    // Datei in den Supabase Storage hochladen
    const { error } = await supabase.storage.from("pdf").upload(folderpath, redactedPDF, {
      upsert: true,
    });

    if (error) {
      throw new Error(`Fehler beim Hochladen: ${error.message}`);
    }

    // Signierte URL generieren
    const { data: signedUrlData, error: signedUrlError } = await supabase.storage
      .from("pdf")
      .createSignedUrl(folderpath, 60);

    if (signedUrlError) {
      throw new Error("Fehler beim Generieren der Signed URL.");
    }

   
    return {
        signedUrl: signedUrlData.signedUrl,
        filename: file.name, 
        folderpath: folderpath,
      };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any){
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      throw new Error(`Fehler beim Hochladen: ${error.message}`)
    }
    
      
  
};


