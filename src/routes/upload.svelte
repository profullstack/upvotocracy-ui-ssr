<script>
  import { globalErrorHandler } from '../components/create-api';

  let files;
  let progress = 0;
  let uploadDisabled = true;
  let fileUrl;

  $: {
    globalErrorHandler(false);
    if (files && files[0].size > 'MAX_UPLOAD_SIZE') {
      globalErrorHandler('file too large');
      uploadDisabled = true;
    }
    else if (files && files[0].size < 'MAX_UPLOAD_SIZE') uploadDisabled = false;
    progress = 0;
    fileUrl = undefined;
  }

  const uploadFile = () => {
    const formdata = new FormData();
    formdata.append("file", files[0]);

    const ajax = new XMLHttpRequest();
    ajax.upload.addEventListener("progress", progressHandler, false);
    ajax.addEventListener("load", completeHandler, false);
    ajax.addEventListener("error", errorHandler, false);
    ajax.open("POST", "http://localhost:8537/api/1/upload"); 
    ajax.setRequestHeader('Authorization', `Bearer ${localStorage.getItem('token')}`);
    ajax.send(formdata);
  }

  function progressHandler(event) {
    const percent = (event.loaded / event.total) * 100;
    progress = Math.round(percent);
  }

  function completeHandler(event) {
    const response = JSON.parse(event.target.response);

    if (response.errors) globalErrorHandler(response.errors);
    
    if (response.url) {
      fileUrl = response.url;
      uploadDisabled = true;
    }
  }

  function errorHandler(event) {
    globalErrorHandler('Upload Failed');
  }
</script>

<form on:submit|preventDefault={uploadFile} method="post" enctype="multipart/form-data">
  <input bind:files={files} type="file" accept="image/*,video/*"/>
  <button disabled={uploadDisabled} type="submit">Upload</button>
</form>

<progress id="progressBar" value={progress} max="100"></progress>
<span>{progress}%</span>

{#if fileUrl}
  <div>
    File uploaded to:
    <a href="{fileUrl}">{fileUrl}</a>
  </div>
{/if}
