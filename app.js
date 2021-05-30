const videoElem = document.querySelector("video");
const audioElem = document.querySelector("audio");

// alert(audioElem);
let cons = { audio: true, video: true };
let allowedPromise = navigator.mediaDevics.getUserMedia(cons);
allowedPromise.then(function (stream) {
	videoElem.srcObject = stream;
	audioElem.srcObject = stream;
});
allowedPromise.catch(function () {
	alert("allow video and camera to access it");
});
