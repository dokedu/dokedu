import { graphql } from "@/gql";
import { File } from "@/gql/graphql";
import { urqlClient } from "@/main";

function forceDownload(url: string, fileName: string) {
  const xhr = new XMLHttpRequest();


  xhr.open("GET", url, true);
  xhr.responseType = "blob";
  xhr.onload = function () {
    const urlCreator = window.URL || window.webkitURL;
    const imageUrl = urlCreator.createObjectURL(this.response);
    const tag = document.createElement("a");
    tag.href = imageUrl;
    tag.download = fileName;
    document.body.appendChild(tag);
    tag.click();
    document.body.removeChild(tag);
  };
  xhr.send();
}

const getFileURL = (variables: { id: string }) => {
  return urqlClient.mutation(

    graphql(`
    mutation previewFile($id: ID!) {
      previewFile(input: { id: $id }) {
        url
      }
    }
  `), variables
  )
}

async function downloadFile(file: File, fileName: string | null = null) {
  const res = await getFileURL({ id: file.id });
  if (res.error) return console.error(res.error);
  const url = res.data?.previewFile.url as string
  if (!fileName) fileName = file.name;
  forceDownload(url, fileName);
}

export default function useDownloadFile() {
  return { downloadFile, getFileURL };
}
