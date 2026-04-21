(()=> {

	/*
		scrollHeight: 0, //스크롤 가능한 전체 컨텐츠 높이
		(페이지전체높이가5000px,뷰포트높이가900px일 때 : document.documentElement.scrollHeight === 5000px
	*/

	let yOffset = 0; // 현재까지의 스크롤량(===window.pageYOffset)
	let currentScene = 0; // 현재 씬
	let prevScrollHeight; // 현재씬 이전까지의 scrollHeight의 합계를 초기화 < 이유 : scene0의높이 + scene1의높이+ scene2의높이...누적하기 위한 준비
	let enterNewScene; // 새로운scene 진입여부 판단위해 잡음(T/F)

	const sceneInfo = [
		{
			// section0
			type: "sticky",
			heightNum: 5, // sticky가 걸릴 때 높이를 얼마나 더 부여해줄 지(몇배)
			scrollHeight: 0, // scene이 사용할 스크롤 높이(길이)
			objs: {
				container: document.querySelector("#scroll-section-0"),
				messageA: document.querySelector("scroll-section-0 .main-message.a"),
				messageB: document.querySelector("scroll-section-0 .main-message.b"),
				messageC: document.querySelector("scroll-section-0 .main-message.c"),
				messageD: document.querySelector("scroll-section-0 .main-message.d"),
			},
			values: {
				// opacity 등에 줄 애니메이션 값 배열모음
				// opacity 0(인라인스타일로 박히는 값), opacity 1, 시작점은 0.1 끝점은 0.2
				messageA_opacity_in: [0, 1, {start: 0.1, end: 0.2}],
				messageB_opacity_in: [0, 1, {start: 0.3, end: 0.4}],
				messageC_opacity_in: [0, 1, {start: 0.5, end: 0.6}],
				messageD_opacity_in: [0, 1, {start: 0.7, end: 0.8}],
				messageA_translateY_in: [20, 0, {start: 0.1, end: 0.2}],
				messageB_translateY_in: [20, 0, {start: 0.3, end: 0.4}],
				messageC_translateY_in: [20, 0, {start: 0.5, end: 0.6}],
				messageD_translateY_in: [20, 0, {start: 0.7, end: 0.8}],
				messageA_opacity_out: [1, 0, {start: 0.25, end: 0.3}],
				messageB_opacity_out: [1, 0, {start: 0.45, end: 0.5}],
				messageC_opacity_out: [1, 0, {start: 0.65, end: 0.7}],
				messageD_opacity_out: [1, 0, {start: 0.85, end: 0.9}],
				messageA_translateY_out: [-20, 0, {start: 0.25, end: 0.3}],
				messageB_translateY_out: [-20, 0, {start: 0.45, end: 0.5}],
				messageC_translateY_out: [-20, 0, {start: 0.65, end: 0.7}],
				messageD_translateY_out: [-20, 0, {start: 0.85, end: 0.9}],
			}
		}, 
		{
			// section1
			type: "normal",
			scrollHeight: 0,
			objs: {
				container: document.querySelector("#scroll-section-1"),
				content: document.querySelector("#scroll-section-1 .description"),
			},
		}, 
		{
			// section2
			type: "sticky",
			heightNum: 5,
			scrollHeight: 0,
			objs: {
				container: document.querySelector("#scroll-section-2"),
				messageA: document.querySelector("#scroll-section-2 .main-message.a"),
				messageB: document.querySelector("#scroll-section-2 .main-message.b"),
				messageC: document.querySelector("#scroll-section-2 .main-message.c"),
				pinB: document.querySelector("#scroll-section-2 .b .pin"),
				pinC: document.querySelector("#scroll-section-2 .c .pin"),
			},
			values: {
				messageA_opacity_in: [0, 1, {start: 0.15, end: 0.2}], 
				messageB_opacity_in: [0, 1, {start: 0.5, end: 0.55}], 
				messageC_opacity_in: [0, 1, {start: 0.72, end: 0.77}],
				messageA_translateY_in: [20, 0, {start: 0.15, end: 0.2}], 
				messageB_translateY_in: [30, 0, {start: 0.5, end: 0.55}], 
				messageC_translateY_in: [30, 0, {start: 0.72, end: 0.77}], 
				messageA_opacity_out: [1, 0, {start: 0.3, end: 0.35}], 
				messageB_opacity_out: [1, 0, {start: 0.58, end: 0.63}], 
				messageC_opacity_out: [1, 0, {start: 0.85, end: 0.9}],
				pinB_scaleY: [0.5, 1, {start: 0.5, end: 0.55}],
				pinC_scaleY: [0.5, 1, {start: 0.34, end: 0.77}],
				pinB_opacity_in: [0, 1, {start: 0.5, end: 0.55}],
				pinC_opacity_in: [0, 1, {start: 0.72, end: 0.77}],
				pinB_opacity_out: [1, 0, {start: 0.58, end: 0.63}],
				pinC_opacity_out: [1, 0, {start: 0.85, end: 0.9}],
			},
		},
	];

	function calcValues(values, currentYOffset){
		let ratioValues;
		const scrollHeight = sceneInfo[currentScene].scrollHeight;
		const scrollRatio = currentYOffset / scrollHeight;

		/*
			1. 목적 : ratioValues
			2. 구간별, 애니메이션별 스크롤비율을 구하기 위해 scrollHeight(기본은 브라우저)를 sceneInfo의 현재씬의 scrollHeight로 바꿔야함
			3. 스크롤비율 기본값을 넣어줘야함 : 스크롤높이를 비율로 바꾸려면 전체 스크롤height에서 현재까지의 스크롤위치를 나눠주면 됨(비율이니까 - 아니고 / 임)
			4. 이후 values의 값 개수 조건에 따라서 진행률 계산 달리 할 거임
		*/

		if(values.length === 3) {
			// values[2]가 존재할 때 : 구간별애니메이션
			const partScrollStart = values[2].start * scrollHeight;
			const partScrollEnd = values[2].end * scrollHeight;
			const partScrollHeight = partScrollEnd - partScrollStart;
			
			if(currentYOffset >= partScrollStart && currentYOffset <= partScrollEnd){
				// 구간 내 진입 했을 때의 진행률 계산
				ratioValues = ((currentYOffset - partScrollStart) / partScrollHeight) * (values[1] - values[0]) + values[0]; 
			}
			if(currentYOffset < partScrollStart){
				// 구간 시작점 진입 이전
				ratioValues = values[0];
			}
			if(currentYOffset > partScrollEnd){
				// 구간 끝점통과 이후 
				ratioValues = values[1];
			}

		}else {
			// values.length === 2 기본 0,1로만 구성되는 애니메이션
			ratioValues = scrollRatio * (values[1] - values[0]) + values[0];
		}

		return ratioValues;
	}

	function playAnimation(){
		/* playAnimation 위해서...
		이제 const에 넣어뒀던 objs와 valuse를 currentScene으로 받아와야 함
		scrollHeight도 당연히 currentScene으로 받고
		currentYOffset도 기본 yoffset에서 이전스크롤height를 뺀 값으로 받아야 함( 현재 yoffset을 알아야 하기 때문에 전체-이전)
		scrollRatio도 calcValuse에서 했던 것처럼 여기서 한 번 더 계산해줌
		
		currentScene은 여전히 숫자임 0,1,2,3...으로 움직임
		해당 값이 갱신되며 case별 애니메이션이 작동함 > case:0, case:1, case:2...여기서의 0,1,2는 currentScene의 값임
		*/
		const objs = sceneInfo[currentScene].objs;
		const values = sceneInfo[currentScene].values;
		const currentYOffset = yOffset - prevScrollHeight;
		const scrollHeight = sceneInfo[currentScene].scrollHeight;
		const scrollRatio = currentYOffset / scrollHeight;
		// console.log(currentScene);

		switch(currentScene){
			case 0:
				console.log('scene 0');
				
				if(scrollRatio <= 0.22) {
					// 0.22 같거나 작을 경우
					// opacity_in : [0, 1, {start: 0.1, end: 0.2}] << 0으로 설정해둠(인라인스타일로 들어감)
					objs.messageA.style.opacity = calcValues(values.messageA_opacity_in, currentYOffset);
					objs.messageA.style.transform = `translate3d(0, ${calcValues(values.messageA_translateY_in, currentYOffset)}%, 0)`;
				}else {
					// 0.22 초과했을 경우

				}

				if(scrollRatio <= 0.42){

				}else {

				}

				break;
			case 2:
				console.log('scene 2');
				break;
			case 3:
				console.log('scene 3');
				break;
		}

	}

	function setBodyID(){
		// ID 가 아니라 id로, id를 바꾸는 거니까 #불필요
		document.body.setAttribute("id", `scroll-section-${currentScene}`);
	}

	// (2)레이아웃부터 골격 잡아야함
	function setLayout(){
		sceneInfo.forEach((scene) => {
			if(scene.type !== "sticky"){
				// sticky 아닐 때
				scene.scrollHeight = scene.objs.container.offsetHeight; 
			}else {
				// sticky 일 때
				scene.scrollHeight = window.innerHeight * scene.heightNum;
			}

			//forEach를 통해 scene 각 container의 offsetHeight나 scrollHeight에 조작을 했으니까, 
			// 브라우저가 읽을 수 있는 값으로 업데이트 해줘야돼
			scene.objs.container.style.height = `${scene.scrollHeight}px`; 
		});
		setBodyID();
	}

	// (3)스크롤 동작 잡기

	// function scrollLoop(){
	// 	// 스크롤을 하는 동안 currentScene이 어디인지 구분해 내기 위한 함수임

	// 	prevScrollHeight = 0;
	// 	enterNewScene = false; // 초기화
		
	// 	// currentScene.forEach((current) => {
	// 	// 	prevScrollHeight += sceneInfo[current].scrollHeight;
	// 	// });
	// 	for(let i = 0; i < currentScene; i++){
	// 		// currentScene는 0으로 초기화된 상태이고, for 돌때마다 0,1,2,3... 으로 증가예정인데
	// 		// prevScrollheight(이전 섹선의 scrollheight)가 i번째 sceneInfo의 scrollheight + 이전섹션스크롤height로 되도록 지정(scrollHeight를 쌓아서 currentScene의 index확인목적?


	// 		// prevScrollHeight = prevScrollHeight + sceneInfo[i].scrollHeight;
	// 		prevScrollHeight += sceneInfo[i].scrollHeight;
	// 	}

	// 	if(yOffset > prevScrollHeight + sceneInfo[currentScene].scrollHeight){
	// 		// 스크롤 내려갈 때
	// 		// 현재스크롤량이 이전스크롤+지금씬의스크롤량보다 클 때 
	// 		// 새로운 씬에 들어왔다고 알 수 있고 currentScene을 증가 시켜줘야함
	// 		// 그리고 body에서도 현재씬의 id 표시해주기
	// 		enterNewScene = true;
	// 		currentScene++;
	// 		setBodyID();
	// 	}
	// 	if(yOffset < prevScrollHeight){
	// 		// 스크롤 올라갈 때
	// 		enterNewScene = true;
			
	// 		// 올라가며 이전 scene으로 이동 중일 때
	// 		currentScene--;
	// 		// 맨위에 닿았을 때
	// 		if(currentScene === 0) {
	// 			return;
	// 		}
	// 		setBodyID();
	// 	}
	// }

	function scrollLoop(){
		
		prevScrollHeight = 0;
		enterNewScene = false; // 시작지점에서는 아직 scene이 바뀌지 않았다고 판단.
		
		// currentScene.forEach((current) => {
		// 	prevScrollHeight += sceneInfo[current].scrollHeight;
		// });

		// 숫자인덱스를 받기 위한 목적이기 때문에 currentScene.forEach를 사용 불가XX
		// 위해서 currentScene이라는 변수에 0이라는 값을 넣었기 때문에 숫자라고 보는 게 적합함.
		for(let i = 0; i < currentScene; i++){ // 현재씬보다 앞에 있는 씬(currentScene이 3 ? i는 0, 1, 2만 순회 : 현재씬 이전씬들의 높이 더할 목적
			prevScrollHeight += sceneInfo[i].scrollHeight; // 실제 누적 공식 > 현재scene이 시작되기 직전까지의 누적스크롤높이임


			// console에서 currentScene이 0,1,2,3 일때 preveScrollHeight값이 어떻게 누적되는지를 찍어보면 좋을 듯

		}

		if(yOffset > prevScrollHeight + sceneInfo[currentScene].scrollHeight){

			enterNewScene = true;
			currentScene++;
			setBodyID();
		}
		if(yOffset < prevScrollHeight){
			enterNewScene = true;
			
			currentScene--;
			if(currentScene === 0) { // 현재scene이 0 이면 함수 즉시 종료라서 currentScene--보다 위에 있어야 됨
				return;
			}
			setBodyID();
		}

		/*
			목적 : currentScene 구별해서 playAnimation에서 사용하기 위함
			1. 현재 scene 이전까지의 높이를 모두 더한다
			2. 현재 스크롤 위치가 현재 scene의 끝보다 아래면 다음 scene으로 간다
			3. 현재 스크롤 위치가 현재 scene의 시작보다 위면 이전 scene으로 간다
			4. scene이 바뀌면 body 상태도 갱신한다
			5. 애니메이션을 실행한다.
			6. 이후 윈도우에서 스크롤될 때 yoffset은 window의pageYOffset으로 받아와서 처리한다. 
		*/

		if(enterNewScene) return;
		playAnimation();
	}


	// setLayout: 레이아웃 조작함수니까 DOMloaded되면 실행 + resize시에도 잡아줘야함
	window.addEventListener("DOMContentLoaded", setLayout);
	window.addEventListener("resize", setLayout);
	window.addEventListener("scroll", ()=> {
		// yOffset을 window의 yOffset 으로 바꿔줘야 현재 스크롤량(yOffset) 확인 가능
		// scrollLoop에서 사용하기 위해 일단 yOffset 을 0으로 초기화해둔 상태였기 때문에 
		// 그냥 두면 window의 yOffset을 받아올 수 없어
		yOffset = window.pageYOffset;
		scrollLoop();
	})

})();