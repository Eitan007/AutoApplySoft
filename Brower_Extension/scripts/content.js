let trust;

chrome.runtime.onMessage.addListener( function(message, sender, sendReponse) {

    if (message.command === "analyze"){
        // Create the text element in the center of overlay1
        const textElement = document.createElement('div');
        textElement.textContent = 'Scanning...';
        textElement.style.position = 'fixed';
        textElement.style.top = '50%';
        textElement.style.left = '50%';
        textElement.style.transform = 'translate(-50%, -50%)';  // Center horizontally and vertically
        textElement.style.color = 'rgba(0, 0, 255, 0.8)';
        textElement.style.fontSize = '2rem';
        textElement.style.zIndex = '9999'; // High z-index to ensure it covers everything
        textElement.style.fontWeight = 'bold';
        textElement.style.pointerEvents = 'none'; // Keep it non-interactive
        textElement.style.display = 'flex'; // Flexbox to align content
        textElement.style.justifyContent = 'center'; // Horizontally center text
        textElement.style.alignItems = 'center'; // Vertically center text
        textElement.style.width = '100vw';  // Full viewport width
        textElement.style.height = '100vh'; // Full viewport height
        document.body.appendChild(textElement);
        

        // Create the first full-screen overlay (top to bottom)
        const overlay1 = document.createElement('div');
        overlay1.style.position = 'fixed';
        overlay1.style.top = '0';
        overlay1.style.left = '0';
        overlay1.style.width = '100vw';
        overlay1.style.height = '100vh';
        overlay1.style.backgroundColor = 'rgba(0, 0, 0, 0.5)'; // Transparent black
        overlay1.style.zIndex = '9998'; // High z-index to ensure it covers everything
        overlay1.style.pointerEvents = 'none'; // Allow interactions with elements below
        overlay1.style.transition = 'background-color 1.5s'; // Smooth color transition
        document.body.appendChild(overlay1);

        // Create the second full-screen overlay (bottom to top)
        const overlay2 = document.createElement('div');
        overlay2.style.position = 'fixed';
        overlay2.style.top = '0';
        overlay2.style.left = '0';
        overlay2.style.width = '100vw';
        overlay2.style.height = '100vh';
        overlay2.style.backgroundColor = 'rgba(0, 0, 0, 0.5)'; // Transparent black
        overlay2.style.zIndex = '9997'; // Slightly lower z-index to avoid overlapping the first overlay
        overlay2.style.pointerEvents = 'none'; // Allow interactions with elements below
        overlay2.style.transition = 'background-color 1.5s'; // Smooth color transition
        document.body.appendChild(overlay2);

        // Keyframes for top-to-bottom movement
        const keyframes1 = `
        @keyframes lusterMovement1 {
            0% {
                transform: translateY(0);
            }
            50% {
                transform: translateY(100vh);
            }
            100% {
                transform: translateY(0);
            }
        }
        `;

        // Keyframes for bottom-to-top movement
        const keyframes2 = `
        @keyframes lusterMovement2 {
            0% {
                transform: translateY(100vh);
            }
            50% {
                transform: translateY(0);
            }
            100% {
                transform: translateY(100vh);
            }
        }
        `;

        // Create style element to add the keyframes
        const style = document.createElement('style');
        style.textContent = keyframes1 + keyframes2; // Add both keyframes to the same style tag
        document.head.appendChild(style);

        // Apply animations to the overlays
        overlay1.style.animation = 'lusterMovement1 5s ease-in-out infinite';
        overlay2.style.animation = 'lusterMovement2 5s ease-in-out infinite';

        // Function to change the color of the overlays
        function changeColor(overlay) {
            overlay.style.backgroundColor = 'rgba(0, 0, 255, 0.5)'; // Transparent blue
            setTimeout(() => {
                overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)'; // Transparent black
            }, 1500); // Duration for blue
        }

        // Start color change cycle for both overlays
        setInterval(() => changeColor(overlay1), 3000); // 3 seconds interval for overlay 1
        setInterval(() => changeColor(overlay2), 3000); // 3 seconds interval for overlay 2

        return
    }

    if (message.command === "fill form"){
        console.log(message.data);
        let data = message.data;
        main(data);
    }

});



function main(data){
    ```
    fills the input fields and checks boxes in the form

    Parameters:
    data (dict): contains the selector[key] and inputdata[value]: string | int | bool

    Returns:
    cancel_scanning_seq(func)

    ```
    let submit;
    let selectors = [];
    let inputs = [];
    let elementtype =[];

    selectors.forEach((selector, index) => {

        select_fill(selector, inputs[index], elementtype[index]);

    });

    cancel_scanning_seq();
    
    // if user doesn't want to review filled out form
    if (trust) {
        setTimeout(()=>{
            submit.click();
        }, 2000);
    }
}



function cancel_scanning_seq(){
    ```
    cancels the scanning display
    ```


}



function select_fill(selector, input, elementtype) {
    ```
    selects and fills each input accordingly
    ```
    //conditions for entrybox, checkbox, dropdown, textarea
    //if submit, do nothing
}