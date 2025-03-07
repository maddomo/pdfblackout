import { createClient } from "~/supabase/client";

const supabase = createClient();

export const uploadToStorage = async (file: File) => {
  

    const user = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error("User is not authenticated.");
    }

    
    const folderpath = `${user.data.user?.id}/${file.name}`;

    // Datei in den Supabase Storage hochladen
    const { error } = await supabase.storage.from("pdf").upload(folderpath, file, {
      upsert: true,
    });

    if (error) {
      throw new Error(`Fehler beim Hochladen: ${error.message}`);
    }

    // Signierte URL generieren
    const { data: signedUrlData, error: signedUrlError } = await supabase.storage
      .from("pdf")
      .createSignedUrl(folderpath, 3600);

    if (signedUrlError) {
      throw new Error("Fehler beim Generieren der Signed URL.");
    }

   
    return {
        signedUrl: signedUrlData.signedUrl,
        filename: file.name, 
      };
      
  
};
