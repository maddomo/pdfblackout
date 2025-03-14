export default async function createDownloadURL(file: File){
    const url = URL.createObjectURL(file);
    return url;
}