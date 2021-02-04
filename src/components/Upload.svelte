<script>
  import { globalErrorHandler } from '../api/create-api';

  export let link;
  export let mediaName;
  export let mediaThumb;
  let files;
  let progress = 0;
  let uploadDisabled = true;

  $: {
    globalErrorHandler(false);
    if (files && files[0].size > 'MAX_UPLOAD_SIZE') {
      globalErrorHandler('file too large');
      uploadDisabled = true;
    } else if (files && files[0].size < 'MAX_UPLOAD_SIZE') uploadDisabled = false;
    progress = 0;
    link = undefined;
  }

  const uploadFile = () => {
    const formdata = new FormData();
    formdata.append('file', files[0]);

    const ajax = new XMLHttpRequest();
    ajax.upload.addEventListener('progress', progressHandler, false);
    ajax.addEventListener('load', completeHandler, false);
    ajax.addEventListener('error', errorHandler, false);
    ajax.open('POST', `${'API_BASE_URL'}/upload`);
    ajax.setRequestHeader('Authorization', `Bearer ${localStorage.getItem('token')}`);
    ajax.send(formdata);
  };

  function progressHandler(event) {
    const percent = (event.loaded / event.total) * 100;
    progress = Math.round(percent);
  }

  function completeHandler(event) {
    const response = JSON.parse(event.target.response);

    if (response.errors) globalErrorHandler(JSON.stringify(response.errors));

    if (response.url) {
      link = response.url;
      mediaName = response.mediaName;
      mediaThumb = response.thumb;
      uploadDisabled = true;
    }
  }

  function errorHandler(event) {
    globalErrorHandler('Upload Failed');
  }
</script>

<form on:submit|preventDefault={uploadFile} method="post" enctype="multipart/form-data">
  <input bind:files type="file" accept="image/*,video/*,application/pdf" />
  <button disabled={uploadDisabled} type="submit">Upload</button>
  <br />
  <progress id="progressBar" value={progress} max="100" />
  <span>{progress}%</span>
</form>
