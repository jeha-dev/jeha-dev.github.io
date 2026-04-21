(()=>{

	let yOffset = 0;
	let prevScrollHeight = 0;
	let currentScene = 0;
	let enterNewScene;

	let acc = 0.1;
	let delayedYOffset = 0;
	let requestAniFrameID;
	let requestAniFrameState;

	const sceneInfo = [
		{
			// section 0
			type : 'sticky',
			heightNum: 5,
			scrollHeight : 0,
			objs : {
				container : document.querySelector("#scroll-section-0"),
				messageA: document.querySelector("#scroll-section-0 .main-message.a"),
				messageB: document.querySelector("#scroll-section-0 .main-message.b"),
				messageC: document.querySelector("#scroll-section-0 .main-message.c"),
				messageD: document.querySelector("#scroll-section-0 .main-message.d"),
				canvas: document.querySelector("#video-canvas-0"),
				context: document.querySelector("#video-canvas-0").getContext("2d"),
				videoImages: [],
			},
			values: {
				messageA_opacity_in: [0, 1, { start: 0.1, end: 0.2 }],
				messageB_opacity_in: [0, 1, { start: 0.3, end: 0.4 }],
				messageC_opacity_in: [0, 1, { start: 0.5, end: 0.6 }],
				messageD_opacity_in: [0, 1, { start: 0.7, end: 0.8 }],
				messageA_translateY_in: [20, 0, { start: 0.1, end: 0.2 }],
				messageB_translateY_in: [20, 0, { start: 0.3, end: 0.4 }],
				messageC_translateY_in: [20, 0, { start: 0.5, end: 0.6 }],
				messageD_translateY_in: [20, 0, { start: 0.7, end: 0.8 }],
				messageA_opacity_out: [1, 0, { start: 0.25, end: 0.3 }],
				messageB_opacity_out: [1, 0, { start: 0.45, end: 0.5 }],
				messageC_opacity_out: [1, 0, { start: 0.65, end: 0.7 }],
				messageD_opacity_out: [1, 0, { start: 0.85, end: 0.9 }],
				messageA_translateY_out: [0, -20, { start: 0.25, end: 0.3 }],
				messageB_translateY_out: [0, -20, { start: 0.45, end: 0.5 }],
				messageC_translateY_out: [0, -20, { start: 0.65, end: 0.7 }],
				messageD_translateY_out: [0, -20, { start: 0.85, end: 0.9 }],
				videoImageCount : 300,
				imageSequence: [0, 299],
				canvas_opacity: [1, 0, {start: 0.9, end: 1}],
			}

		},
		{
			// section 1 :
			type : 'normal',
			scrollHeight : 0,
			objs: {
				container: document.querySelector('#scroll-section-1'),
				content: document.querySelector('#scroll-section-1 .description')
			}

		},
		{
			// section 2
			type : 'sticky',
			heightNum: 5,
			scrollHeight : 0,
			objs: {
				container: document.querySelector('#scroll-section-2'),
				messageA: document.querySelector('#scroll-section-2 .a'),
				messageB: document.querySelector('#scroll-section-2 .b'),
				messageC: document.querySelector('#scroll-section-2 .c'),
				pinB: document.querySelector('#scroll-section-2 .b .pin'),
				pinC: document.querySelector('#scroll-section-2 .c .pin'),
				canvas: document.querySelector("#video-canvas-1"),
				context: document.querySelector("#video-canvas-1").getContext("2d"),
				videoImages: [],
			},
			values: {
				messageA_translateY_in: [20, 0, { start: 0.15, end: 0.2 }],
				messageB_translateY_in: [30, 0, { start: 0.6, end: 0.65 }],
				messageC_translateY_in: [30, 0, { start: 0.87, end: 0.92 }],
				messageA_opacity_in: [0, 1, { start: 0.25, end: 0.3 }],
				messageB_opacity_in: [0, 1, { start: 0.6, end: 0.65 }],
				messageC_opacity_in: [0, 1, { start: 0.87, end: 0.92 }],
				messageA_translateY_out: [0, -20, { start: 0.4, end: 0.45 }],
				messageB_translateY_out: [0, -20, { start: 0.68, end: 0.73 }],
				messageC_translateY_out: [0, -20, { start: 0.95, end: 1 }],
				messageA_opacity_out: [1, 0, { start: 0.4, end: 0.45 }],
				messageB_opacity_out: [1, 0, { start: 0.68, end: 0.73 }],
				messageC_opacity_out: [1, 0, { start: 0.95, end: 1 }],
				pinB_scaleY: [0.5, 1, { start: 0.6, end: 0.65 }],
				pinC_scaleY: [0.5, 1, { start: 0.87, end: 0.92 }],
				pinB_opacity_in: [0, 1, { start: 0.6, end: 0.65 }],
				pinC_opacity_in: [0, 1, { start: 0.87, end: 0.92 }],
				pinB_opacity_out: [1, 0, { start: 0.68, end: 0.73 }],
				pinC_opacity_out: [1, 0, { start: 0.95, end: 1 }],
				videoImageCount : 960,
				imageSequence: [0, 959],
				canvas_opacity_in: [0, 1, {start: 0, end: 0.1}],
				canvas_opacity_out: [1, 0, {start: 0.95, end: 1}],
			}
		},
		{
			// section 3
			type : 'sticky',
			heightNum: 5,
			scrollHeight : 0,
			objs: {
				container: document.querySelector('#scroll-section-3'),
				canvasCaption: document.querySelector('.canvas-caption'),
				canvas : document.querySelector(".image-blend-canvas"),
				context: document.querySelector(".image-blend-canvas").getContext("2d"),
				imagesPath: [
					'./images/blend-image-1.jpg',
					'./images/blend-image-2.jpg',
				],
				images: [],
			},
			values: {
				rect1X: [0, 0, {start: 0, end: 0}],
				rect2X: [0, 0, {start: 0, end: 0}],
				rectStartY: 0,
			}
		},
	];

	/* 함수모음 */
	function setCanvasImages(){
		let imgElem;
		for(let i=0; i<sceneInfo[0].values.videoImageCount; i++){
			imgElem = document.createElement("img");
			imgElem.src = `./video/001/IMG_${6726 + i}.JPG`;
			sceneInfo[0].objs.videoImages.push(imgElem);
		}

		let imgElem2;
		for(let i=0; i<sceneInfo[2].values.videoImageCount; i++){
			imgElem2 = document.createElement("img");
			imgElem2.src = `./video/002/IMG_${7027 + i}.JPG`;
			sceneInfo[2].objs.videoImages.push(imgElem2);
		}
		// console.log(sceneInfo[0].objs.videoImages);
		
		let imgElem3;
		for(let i=0; i < sceneInfo[3].objs.imagesPath.length; i++){
			imgElem3 = document.createElement("img");
			imgElem3.src = sceneInfo[3].objs.imagesPath[i];
			sceneInfo[3].objs.images.push(imgElem3);
		}
	// console.log(sceneInfo[3].objs.images);
	}


	function setBodyID() {
		document.body.setAttribute('id', `show-scene-${currentScene}`);
	}
	function setLayout(){
		// 각 스크롤 섹션의 높이 세팅

		for(let i = 0; i < sceneInfo.length; i++){
			if (sceneInfo[i].type === 'sticky') {
				sceneInfo[i].scrollHeight = sceneInfo[i].heightNum * window.innerHeight;
			} else if (sceneInfo[i].type === 'normal')  {
				sceneInfo[i].scrollHeight = sceneInfo[i].objs.content.offsetHeight + window.innerHeight * 0.5;
			}
			sceneInfo[i].objs.container.style.height = `${sceneInfo[i].scrollHeight}px`;
		}

		/* 현재 씬의 인덱스 찾으려고 작성, totalScrollHeight에 scene.scrollHeight 누적해서 currentScene을 찾았으면 빠져나와라 */
		yOffset = window.pageYOffset; // 현재스크롤위치(window에서 얼마나 스크롤했는지의 양)
		let totalScrollHeight = 0; //전체스크롤가능한컨텐츠높이 = 0 으로 초기화 해줌
		for(let i=0; i < sceneInfo.length; i++){ // 다시 sceneInfo 받아서 반복중..목적?
			totalScrollHeight += sceneInfo[i].scrollHeight;  // scene들의 스크롤길이를 누적해서 현재 스크롤이 어느 scene에 속하는지 찾기 위함
			if(yOffset <= totalScrollHeight){ // 만약 현재스크롤위치가 전체 스크롤보다 작거나 같을 때 
				currentScene = i; // 지금 씬의 인덱스는 i?
				break;
			}
		}
		setBodyID();

		const heightRatio = window.innerHeight/1080;
		// console.log(heightRatio);
		sceneInfo[0].objs.canvas.style.transform = `translate3d(-50%, -50%, 0) scale(${heightRatio})`; // translate3d(0,0,0)으로 잡아야 가로center도 맞출 수 있음
		sceneInfo[2].objs.canvas.style.transform = `translate3d(-50%, -50%, 0) scale(${heightRatio})`; // translate3d(0,0,0)으로 잡아야 가로center도 맞출 수 있음
	}
	// 6 opacity값 증감 관련 계산 담당할 함수 만듦
	function calcValues(values,currentYOffset){// 현재섹션의 pageYOffset이 필요__currentYOffset에 따라 values의 opacity값이 0~1까지 증감할 때 비율로 잘 증감하는 지 확인

		// 9스크롤량 비율값으로 계산하기
		let rv;
		const scrollHeight = sceneInfo[currentScene].scrollHeight;
		const scrollRatio = currentYOffset / scrollHeight ; // 현재스크롤얼마나했는지 /현재씬전체범위(즉현재씬스크롤높이값)
		// 오퍼시티에 [0,1] 대한 전체 범위 : 끝값-시작값
		// 전체범위 * scrollRatio + 시작값


		if(values.length === 3){
			// { start, end } 구간을 적용한 애니메이션 실행

			const partScrollStart = values[2].start * scrollHeight;
			const partScrollend = values[2].end * scrollHeight;
			const partScrollHeight = partScrollend - partScrollStart;

			if(currentYOffset >= partScrollStart && currentYOffset <= partScrollend){ // 범위 안
				rv = (currentYOffset - partScrollStart) / partScrollHeight  * (values[1] - values[0]) + values[0];
			}else if(currentYOffset < partScrollStart){
				rv = values[0];
			}else if(currentYOffset > partScrollend){
				rv = values[1];
			}
		}else{
			// length가 3이 아닌 경우에는 기본값 0~1까지 비율 없이 쭉 애니메이션 실행
			rv =scrollRatio * (values[1] - values[0]) + values[0]; 
		}

		return rv;

	}

	function playAnimation() {
		const objs = sceneInfo[currentScene].objs;
		const values = sceneInfo[currentScene].values;
		const currentYOffset = yOffset - prevScrollHeight;
		const scrollHeight = sceneInfo[currentScene].scrollHeight;
		const scrollRatio = currentYOffset / scrollHeight;
	
		switch (currentScene) {
			case 0:
				console.log('0 play');
				// let sequence = Math.round(calcValues(values.imageSequence, currentYOffset));
				// // console.log(sequence);
				// objs.context.drawImage(objs.videoImages[sequence], 0, 0);
				objs.canvas.style.opacity = calcValues(values.canvas_opacity, currentYOffset);

				if (scrollRatio <= 0.22) { // scrollRatio 범위 설정
					// in
					objs.messageA.style.opacity = calcValues(values.messageA_opacity_in, currentYOffset);
					objs.messageA.style.transform = `translate3d(0, ${calcValues(values.messageA_translateY_in, currentYOffset)}%, 0)`;
				} else {
					// out
					objs.messageA.style.opacity = calcValues(values.messageA_opacity_out, currentYOffset);
					objs.messageA.style.transform = `translate3d(0, ${calcValues(values.messageA_translateY_out, currentYOffset)}%, 0)`;
				}
	
				if (scrollRatio <= 0.42) {
					// in
					objs.messageB.style.opacity = calcValues(values.messageB_opacity_in, currentYOffset);
					objs.messageB.style.transform = `translate3d(0, ${calcValues(values.messageB_translateY_in, currentYOffset)}%, 0)`;
				} else {
					// out
					objs.messageB.style.opacity = calcValues(values.messageB_opacity_out, currentYOffset);
					objs.messageB.style.transform = `translate3d(0, ${calcValues(values.messageB_translateY_out, currentYOffset)}%, 0)`;
				}
	
				if (scrollRatio <= 0.62) {
					// in
					objs.messageC.style.opacity = calcValues(values.messageC_opacity_in, currentYOffset);
					objs.messageC.style.transform = `translate3d(0, ${calcValues(values.messageC_translateY_in, currentYOffset)}%, 0)`;
				} else {
					// out
					objs.messageC.style.opacity = calcValues(values.messageC_opacity_out, currentYOffset);
					objs.messageC.style.transform = `translate3d(0, ${calcValues(values.messageC_translateY_out, currentYOffset)}%, 0)`;
				}
	
				if (scrollRatio <= 0.82) {
					// in
					objs.messageD.style.opacity = calcValues(values.messageD_opacity_in, currentYOffset);
					objs.messageD.style.transform = `translate3d(0, ${calcValues(values.messageD_translateY_in, currentYOffset)}%, 0)`;
				} else {
					// out
					objs.messageD.style.opacity = calcValues(values.messageD_opacity_out, currentYOffset);
					objs.messageD.style.transform = `translate3d(0, ${calcValues(values.messageD_translateY_out, currentYOffset)}%, 0)`;
				}
	
				break;
	
			case 2:
				console.log('2 play');
				// let sequence2 = Math.round(calcValues(values.imageSequence, currentYOffset));
				// // console.log(sequence);
				// objs.context.drawImage(objs.videoImages[sequence2], 0, 0);

				if (scrollRatio <= 0.5) {
					// in
					objs.canvas.style.opacity = calcValues(values.canvas_opacity_in, currentYOffset);
				} else {
					// out
					objs.canvas.style.opacity = calcValues(values.canvas_opacity_out, currentYOffset);
				}
				
				if (scrollRatio <= 0.32) {
					// in
					objs.messageA.style.opacity = calcValues(values.messageA_opacity_in, currentYOffset);
					objs.messageA.style.transform = `translate3d(0, ${calcValues(values.messageA_translateY_in, currentYOffset)}%, 0)`;
				} else {
					// out
					objs.messageA.style.opacity = calcValues(values.messageA_opacity_out, currentYOffset);
					objs.messageA.style.transform = `translate3d(0, ${calcValues(values.messageA_translateY_out, currentYOffset)}%, 0)`;
				}
	
				if (scrollRatio <= 0.57) {
					// in
					objs.messageB.style.transform = `translate3d(0, ${calcValues(values.messageB_translateY_in, currentYOffset)}%, 0)`;
					objs.messageB.style.opacity = calcValues(values.messageB_opacity_in, currentYOffset);
					objs.pinB.style.transform = `scaleY(${calcValues(values.pinB_scaleY, currentYOffset)})`;
				} else {
					// out
					objs.messageB.style.transform = `translate3d(0, ${calcValues(values.messageB_translateY_out, currentYOffset)}%, 0)`;
					objs.messageB.style.opacity = calcValues(values.messageB_opacity_out, currentYOffset);
					objs.pinB.style.transform = `scaleY(${calcValues(values.pinB_scaleY, currentYOffset)})`;
				}
	
				if (scrollRatio <= 0.83) {
					// in
					objs.messageC.style.transform = `translate3d(0, ${calcValues(values.messageC_translateY_in, currentYOffset)}%, 0)`;
					objs.messageC.style.opacity = calcValues(values.messageC_opacity_in, currentYOffset);
					objs.pinC.style.transform = `scaleY(${calcValues(values.pinC_scaleY, currentYOffset)})`;
				} else {
					// out
					objs.messageC.style.transform = `translate3d(0, ${calcValues(values.messageC_translateY_out, currentYOffset)}%, 0)`;
					objs.messageC.style.opacity = calcValues(values.messageC_opacity_out, currentYOffset);
					objs.pinC.style.transform = `scaleY(${calcValues(values.pinC_scaleY, currentYOffset)})`;
				}

				// case2에서 캔버스 미리 그려줌
				if(scrollRatio > 0.9) { 
					const objs = sceneInfo[3].objs;
					const values = sceneInfo[3].values;
					const widthRatio = window.innerWidth / objs.canvas.width;
					const heightRatio = window.innerHeight / objs.canvas.height;
					let canvasScaleRatio;

					if(widthRatio <= heightRatio){
						canvasScaleRatio = heightRatio;
					}else {
						canvasScaleRatio = widthRatio;
					}
					objs.canvas.style.transform = `scale(${canvasScaleRatio})`;
					objs.context.fillStyle = '#fff';
					objs.context.drawImage(objs.images[0], 0, 0);

					// 각 박스의 X좌표 세팅
					const reCalclatedInnerWidth = document.body.offsetWidth / canvasScaleRatio;
					const whiteRectWidth = reCalclatedInnerWidth * 0.15;
					values.rect1X[0] = (objs.canvas.width - reCalclatedInnerWidth) / 2;
					values.rect1X[1] = values.rect1X[0] - whiteRectWidth;
					values.rect2X[0] = values.rect1X[0] + reCalclatedInnerWidth - whiteRectWidth;
					values.rect2X[1] = values.rect2X[0] + whiteRectWidth;
					objs.context.fillRect(
						parseInt(values.rect1X[0]),
						0, 
						parseInt(whiteRectWidth), 
						objs.canvas.height
					);

					objs.context.fillRect(
						parseInt(values.rect2X[0]),
						0, 
						parseInt(whiteRectWidth), 
						objs.canvas.height
					);
				}

				
	
				break;
	
			case 3:
				console.log('3 play');
				// 가로세로 모두 꽉차게 하기 위한 세팅이 필요(모든 해상도 대응 : 스마트폰 가로의 경우도 
				const widthRatio = window.innerWidth / objs.canvas.width;
				const heightRatio = window.innerHeight / objs.canvas.height;
				// console.log(widthRatio, heightRatio);
				let canvasScaleRatio;

				if(widthRatio <= heightRatio){
					canvasScaleRatio = heightRatio;
					// console.log("heightRatio를 follow");
				}else {
					canvasScaleRatio = widthRatio;
					// console.log("widthRatio를 follow");
				}
				// console.log(objs.canvas);
				objs.canvas.style.transform = `scale(${canvasScaleRatio})`;
				objs.context.fillStyle = '#fff';
				objs.context.drawImage(objs.images[0], 0, 0);

				// 캔버스사이즈 기준으로 가정하는 innerHeight, innerWidth
				// const reCalclatedInnerWidth = window.innerWidth / canvasScaleRatio; // 가운데 우리 눈에 보이는 viewport 사이즈의 canvas
				const reCalclatedInnerWidth = document.body.offsetWidth / canvasScaleRatio; // 스크롤바 사이즈 때문에 width가 정확히 안 찍힘 > window.innerWidth>>body.offsetWidth
				const reCalclatedInnerHeight = window.innerHeight / canvasScaleRatio; 
				// console.log(reCalclatedInnerWidth, reCalclatedInnerHeight);

				if(!values.rectStartY){
					// 값이 false(0)일 때만 출력(스크롤을 계속 내려도 안 찍히게 세팅)
					// values.rectStartY = objs.canvas.getBoundingClientRect().top; // getBoundingClientRect.top를 사용하니 스크롤빠르게 하면 잘 못 잡음
					// values.rectStartY = objs.canvas.offsetTop; // 고정값인 대신 OffsetTop은 문서 처음~ 해당섹션까지 얼마나 떨어져있는지를 받아옴 >> 3번씩이 시작될 때를 기준점으로 잡으면 돼
					// 내부요소들은 position을 잡을 때 부모요소로 잡으려면 3번씬의 position을 relative로 하면 돼
					// 캔버스의 scale이 높이를 기준으로 줄었다가 늘어나는 거라서 offsetTop이 적게 잡힘
					// offsetTop을 그냥 주면 안 됨
					// (섹션3의 offsetTop으로부터 scale로 줄어든 캔버스 높이 - 섹션3의 offsetTop으로부터 scale(1)된 후의 캔버스 높이 )/2(스케일은 중앙중심이라 위아래 둘다 적용하니까 /2 해줘야 함)
					values.rectStartY = objs.canvas.offsetTop + (objs.canvas.height - objs.canvas.height * canvasScaleRatio) / 2;

					// console.log(values.rectStartY);
					values.rect1X[2].start = (window.innerHeight / 2) / scrollHeight;
					values.rect2X[2].start = (window.innerHeight / 2) / scrollHeight;
					values.rect1X[2].end = values.rectStartY / scrollHeight;
					values.rect2X[2].end = values.rectStartY / scrollHeight;
				}

				// 각 박스의 X좌표 세팅
				const whiteRectWidth = reCalclatedInnerWidth * 0.15; // sceneInfo에 x좌표 추가해줘야함
				values.rect1X[0] = (objs.canvas.width - reCalclatedInnerWidth) / 2; // 전체가로 뺀 값의 / 2 
				values.rect1X[1] = values.rect1X[0] - whiteRectWidth; // 박스가 벌어진다는 것 : x가 화면 바깥으로 나가는 것(왼쪽으로 나가는 건 빼줘야함)
				values.rect2X[0] = values.rect1X[0] + reCalclatedInnerWidth - whiteRectWidth; // 오른쪽박스인데 식이 조금 다른 이유생각해보기
				values.rect2X[1] = values.rect2X[0] + whiteRectWidth; // 자기 폭 더함(방향이 다르기 때문에 오른쪽으로 가는 거기 때문에 더해줌)

				// 좌우 흰색박스 그리는 건 fillRect로 + canvas에서 그릴 땐 정수처리 해줘야 성능 빠름 : partInt()
				// objs.context.fillRect(values.rect1X[0], 0, parseInt(whiteRectWidth), reCalclatedInnerHeight);
				// objs.context.fillRect(values.rect2X[0], 0, parseInt(whiteRectWidth), reCalclatedInnerHeight);

				// 실제로 애니메이트 해볼 수 있는 코드
				objs.context.fillRect(parseInt(calcValues(values.rect1X, currentYOffset)), 0, parseInt(whiteRectWidth), objs.canvas.height);
				objs.context.fillRect(parseInt(calcValues(values.rect2X, currentYOffset)), 0, parseInt(whiteRectWidth), objs.canvas.height);

				break;

				case 4:
					console.log('4번 생성 했는데..');
					break;
		}
	}
	function scrollLoop(){
		prevScrollHeight = 0;
		// 섹션이 바뀌는 순간에 (특히 위로 올라갈 때) 1 > 0 > -0 > 0.999 이렇식으로 음수가 나오는 걸 방지하기 위해서 변수 추가 후 조건 적용(enterNewScene)
		enterNewScene = false;
	
		for (let i = 0; i < currentScene; i++) {
			prevScrollHeight += sceneInfo[i].scrollHeight;
		}

		if(delayedYOffset > prevScrollHeight + sceneInfo[currentScene].scrollHeight){ // 내려갈 때
			enterNewScene = true;
			if(currentScene < sceneInfo.length - 1){
				currentScene++;	
			}
			
			setBodyID();
		}
		if(delayedYOffset < prevScrollHeight){ // 올라갈 때 
			enterNewScene = true;

			if(currentScene === 0){
				return
			}
			currentScene--;
			setBodyID();
		}
		if(enterNewScene) return;
		// console.log(currentScene);

		playAnimation();
	}

	function smoothAnimationLoop(){
		/* smoothAnimationLoop에서는 yOffset대신 delayedYOffset으로 처리중 > yOffset 다양한 곳들에서 활용되는데 그 중에서도 scene이 바뀔 때를 잘 봐야함

		scrollLoop 에서 yOffset이 prevScrollHeight에 따라서 currentScene을 업데이트 해줌()
		yOffset은 window에서 바로 받아온 것, delayedyoffset은 계산을 해서 실제로 delay가 생기기 떄문에
		scrollLoop에서도 delayedYoffset으로 변경해줄 필요가 있음
		*/
		delayedYOffset = delayedYOffset + (yOffset - delayedYOffset) * acc;

		if(!enterNewScene){
			/* 감속적용 시 씬이 바뀔 때 캔버스 draw 계산오차 생김 - !enterNewScene 때만 실행하도록  */
			
			if(currentScene === 0 || currentScene === 2){
				const currentYOffset = delayedYOffset - prevScrollHeight;
				const objs = sceneInfo[currentScene].objs;
				const values = sceneInfo[currentScene].values;

				// console.log('loop');
	
				let sequence = Math.round(calcValues(values.imageSequence, currentYOffset));
				let sequence2 = Math.round(calcValues(values.imageSequence, currentYOffset));

				if(objs.videoImages[sequence]){ /* 캔버스 로드 에러 : 해당 sequece가 존재할 때만 실행 */
					objs.context.drawImage(objs.videoImages[sequence], 0, 0);
					objs.context.drawImage(objs.videoImages[sequence2], 0, 0);
				}
			}
		}

		requestAniFrameID = requestAnimationFrame(smoothAnimationLoop);

		if(Math.abs(yOffset - delayedYOffset) < 1) {
			cancelAnimationFrame(requestAniFrameID);
			requestAniFrameState = false;
		}
	}
	smoothAnimationLoop();

	window.addEventListener('DOMContentLoaded',setLayout);

	window.addEventListener('resize', ()=>{
		if(window.innerWidth > 900) {
			// setLayout();
			window.location.reload();
		}
	});
	window.addEventListener('orientationchange', ()=>{
		scrollTo(0, 0); // 휴대폰을 가로로 두면 스크롤 맨 위로 올리기
		setTimeout(()=>{
			window.location.reload();
		}, 500);
	});

	window.addEventListener('scroll', ()=>{

		yOffset = window.pageYOffset;
		scrollLoop();
		
		if(!requestAniFrameState){
			requestAniFrameID = requestAnimationFrame(smoothAnimationLoop);
			requestAniFrameState = true;
		}

	});
	setCanvasImages();

})();