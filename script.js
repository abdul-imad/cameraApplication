const videoElem = document.querySelector("video");
const canvas = document.querySelector("canvas");
const recordBtn = document.querySelector(".record");
const captureBtn = document.querySelector(".capture");
const filterContainer = document.querySelector(".filter-container");
const filterOverlay = document.querySelector(".filter-overlay");
const filter = document.querySelectorAll(".filter");
const timer = document.querySelector(".timer");
const recBlink = document.querySelector(".rec-symbol");
const zoomIn = document.querySelector(".zoom-in");
const zoomOut = document.querySelector(".zoom-out");

let isRecording = false;
let isPause = false;
let recording = [];
let videoObj;
let filterColor = "";
let hr = 0;
let min = 0;
let sec = 0;
let zoomLevel = 1;
let cons = { audio: true, video: true };

navigator.mediaDevices
	.getUserMedia(cons)
	.then(function (stream) {
		videoElem.srcObject = stream;
		// audioElem.srcObject = stream;
		videoObj = new MediaRecorder(stream);
		videoObj.addEventListener("dataavailable", (e) => {
			recording.push(e.data);
		});
		videoObj.addEventListener("stop", () => {
			let blob = new Blob(recording, { type: "video/mp4" });
			let url = window.URL.createObjectURL(blob);
			let a = document.createElement("a");
			a.download = "file.mp4";
			a.href = url;
			a.click();
			recording = [];
		});
	})
	.catch(function (err) {
		console.log(err);
		alert("Give access to camera and microphone");
	});

recordBtn.addEventListener("click", () => {
	if (videoObj == undefined) {
		alert("Open both Microphone and Camera");
		return;
	}
	if (isRecording === false) {
		filterContainer.style.display = "none";
		isRecording = true;
		videoObj.start();
		startTimer();
		recordBtn.classList.add("isRecording");
		timer.style.display = "block";
		recBlink.style.display = "block";
	} else {
		filterContainer.style.display = "block";
		isRecording = false;
		videoObj.stop();
		resetTimer();
		recordBtn.classList.remove("isRecording");
		timer.style.display = "none";
		recBlink.style.display = "none";
	}
});

function startTimer() {
	if (isRecording == true) {
		sec = parseInt(sec);
		min = parseInt(min);
		hr = parseInt(hr);
		sec = sec + 1;
		if (sec === 60) {
			min += 1;
			sec = 0;
		}
		if (min === 60) {
			hr += 1;
			min = 0;
		}
		if (sec < 10 || sec == 0) {
			sec = "0" + sec;
		}
		if (min < 10 || min == 0) {
			min = "0" + min;
		}
		if (hr < 10 || hr == 0) {
			hr = "0" + hr;
		}
		setTimeout(() => {
			startTimer();
		}, 1000);
		timer.innerText = hr + ":" + min + ":" + sec;
	}
}

function resetTimer() {
	(sec = 0), (min = 0), (hr = 0);
	timer.innerText = hr + ":" + min + ":" + sec;
}

captureBtn.addEventListener("click", () => {
	captureBtn.classList.add("capture-anim");

	let canvas = document.createElement("canvas");
	canvas.width = videoElem.videoWidth;
	canvas.height = videoElem.videoHeight;
	let tool = canvas.getContext("2d");

	tool.scale(zoomLevel, zoomLevel);
	const x = (tool.canvas.width / zoomLevel - canvas.width) / 2;
	const y = (tool.canvas.height / zoomLevel - canvas.height) / 2;

	tool.drawImage(videoElem, x, y);
	if (filterColor) {
		tool.fillStyle = filterColor;
		tool.fillRect(0, 0, canvas.width * zoomLevel, canvas.height * zoomLevel);
	}
	let url = canvas.toDataURL();
	let a = document.createElement("a");
	a.download = "photo.jpg";
	a.href = url;
	a.click();
	a.remove();
	setTimeout(() => {
		captureBtn.classList.remove("capture-anim");
	}, 1000);
});

for (let i = 0; i < filter.length; i++) {
	filter[i].addEventListener("click", () => {
		for (let j = 0; j < filter.length; j++) {
			filter[j].classList.remove("active");
		}
		filter[i].classList.add("active");
		let filterStyle = filter[i].getAttribute("style");
		let bgColor = filterStyle.split(" ")[1].trim();
		if (bgColor == "#00000000") {
			filterOverlay.style.backgroundColor = "#00000000";
		} else {
			let bgColorWTOpacity = bgColor.split("c")[0];
			filterOverlay.style.backgroundColor = bgColorWTOpacity + "50";
			filterColor = bgColorWTOpacity + "50";
		}
	});
}

zoomOut.style.color = "gray";

zoomIn.addEventListener("click", () => {
	if (zoomLevel < 3) {
		zoomLevel += 0.1;
		videoElem.style.transform = `scale(${zoomLevel})`;
	}

	if (zoomLevel >= 3) {
		zoomIn.style.color = "gray";
	} else if (zoomLevel > 1) {
		zoomOut.style.color = "#fff";
	}
});

zoomOut.addEventListener("click", () => {
	if (zoomLevel > 1) {
		zoomLevel -= 0.1;
		videoElem.style.transform = `scale(${zoomLevel})`;
	}
	if (zoomLevel <= 1) {
		zoomOut.style.color = "gray";
	} else if (zoomLevel < 3) {
		zoomIn.style.color = "#fff";
	}
});
// pauseBtn.onclick = function () {
// 	if (isPause == false) {
// 		videoObj.pause();
//         pauseBtn.innerText = "Resume";

// 		// recording paused
// 	} else {
// 		videoObj.resume();
//         pauseBtn.innerText = "Pause";

// 		// resume recording
// 	}
// 	isPause = !isPause;
// };
