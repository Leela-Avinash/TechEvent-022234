import React, { useState, useEffect } from "react";
import { TypeAnimation } from "react-type-animation";

const Level3 = () => {
    // Load stored data from localStorage if it exists.
    const storedData = JSON.parse(localStorage.getItem("submissionData")) || {};
    // Convert submissionTimes strings back into Date objects (if any).
    const initialSubmissionTimes = storedData.submissionTimes
        ? storedData.submissionTimes.map((time) => new Date(time))
        : [];

    const questions = [
        "who are you",
        "what is your mission",
        "enter the passcode",
    ];
    const correctAnswers = ["astronaut", "explore zenithium", "022234"]; // Replace with your correct answers

    const hackingStatements = [
        "Accessing system files...",
        "Bypassing firewall...",
        "Decrypting secure data...",
        "Loading modules...",
        "Initializing hack...",
        "Extracting data packets...",
        "System override complete!",
        "Scanning for vulnerabilities...",
        "Injecting malicious code...",
        "Evading detection systems...",
        "Intercepting encrypted signals...",
        "Gaining unauthorized access...",
        "Decrypting mainframe...",
        "Overriding security protocols...",
    ];

    // Initialize state with stored data if available.
    const [questionIndex, setQuestionIndex] = useState(
        storedData.questionIndex || 0
    );
    const [correctAnswersCount, setCorrectAnswersCount] = useState(
        storedData.correctAnswers || 0
    );
    const [submissionTimes, setSubmissionTimes] = useState(
        initialSubmissionTimes
    );
    const totalRings = 3; // Total number of firewall rings
    const [remainingRings, setRemainingRings] = useState(
        storedData.remainingRings !== undefined
            ? storedData.remainingRings
            : totalRings
    );

    const userEmail = localStorage.getItem("userEmail"); // Replace with actual user email if needed.

    // Other state variables.
    const [inputValue, setInputValue] = useState("");
    const [hackingText, setHackingText] = useState("");
    const [isHacking, setIsHacking] = useState(false);
    const [flickerRingIndex, setFlickerRingIndex] = useState(null);
    const [message, setMessage] = useState(null);
    const [messageType, setMessageType] = useState(null);
    const [firewallsBroken, setFirewallsBroken] = useState(false);

    // Fisher-Yates shuffle to randomize the hacking statements.
    const shuffleArray = (array) => {
        const arr = [...array];
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    };

    // Persist state changes to localStorage.
    useEffect(() => {
        const submissionData = {
            questionIndex,
            correctAnswers: correctAnswersCount,
            submissionTimes,
            remainingRings,
        };
        localStorage.setItem("submissionData", JSON.stringify(submissionData));
    }, [questionIndex, correctAnswersCount, submissionTimes, remainingRings]);

    // Send submission data to the backend whenever correctAnswersCount or submissionTimes updates.
    useEffect(() => {
        if (correctAnswersCount > 0) {
            const submissionData = {
                email: userEmail,
                correctAnswers: correctAnswersCount,
                submissionTimes: submissionTimes,
            };

            console.log(submissionData);

            fetch("http://localhost:5000/api/level3/submit", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(submissionData),
            })
                .then((response) => response.json())
                .then((data) =>
                    console.log("Data submitted successfully:", data)
                )
                .catch((error) =>
                    console.error("Error submitting data:", error)
                );
        }
    }, [correctAnswersCount, submissionTimes, userEmail]);

    // When the user presses Enter (and input is not empty), trigger the hacking sequence.
    const handleKeyDown = (e) => {
        if (e.key === "Enter" && inputValue.trim() !== "" && !isHacking) {
            const isCorrect =
                inputValue.trim().toLowerCase() ===
                correctAnswers[questionIndex].toLowerCase();
            setMessage(null);
            setMessageType(null);

            const shuffledStatements = shuffleArray(hackingStatements); // Randomize statements
            setHackingText(""); // Clear previous hacking text
            setIsHacking(true);
            const resultMessage = isCorrect
                ? "ACCESS GRANTED"
                : "ACCESS DENIED";

            if (isCorrect) {
                setFlickerRingIndex(totalRings - remainingRings);
                setCorrectAnswersCount((prevCount) => prevCount + 1);

                // Get IST timestamp
                const now = new Date();
                const utcTime = now.getTime() + now.getTimezoneOffset() * 60000;
                const istTime = new Date(utcTime + 5.5 * 60 * 60000);
                setSubmissionTimes((prevTimes) => [...prevTimes, istTime]);
            }

            let index = 0;
            const interval = setInterval(() => {
                if (index < shuffledStatements.length) {
                    setHackingText(
                        (prevText) =>
                            prevText + shuffledStatements[index] + "\n"
                    ); // Add line by line
                    index++;
                } else {
                    clearInterval(interval);
                    setTimeout(() => {
                        // Pass the result message directly.
                        handleHackingComplete(resultMessage);
                    }, 1000); // Delay before showing result
                }
            }, 500); // Adjust timing for line appearance
        }
    };

    const handleHackingComplete = (resultMessage) => {
        setHackingText("");
        setInputValue("");
        setIsHacking(false);
        setMessage(resultMessage);
        setMessageType(
            resultMessage === "ACCESS GRANTED" ? "success" : "error"
        );

        if (resultMessage === "ACCESS GRANTED") {
            setTimeout(() => {
                setRemainingRings((prev) => prev - 1);
                setFlickerRingIndex(null);
                if (questionIndex < questions.length - 1) {
                    setMessage(null);
                    setMessageType(null);
                    setQuestionIndex((prev) => prev + 1);
                } else {
                    setTimeout(() => {
                        setFirewallsBroken(true);
                    }, 2000);
                }
            }, 1000);
        } else {
            setFlickerRingIndex(null);
        }
    };

    return (
        <div
            className="flex h-screen items-center justify-around bg-cover bg-center"
            style={{ backgroundImage: "url('images/image2.jpg')" }}
        >
            {/* Left container: Firewall rings */}
            <div className="relative h-[450px] w-[450px] bg-black flex items-center justify-center">
                {/* Outer rings with glowing effect */}
                <div className="relative h-[300px] w-[300px]">
                    {remainingRings === 3 && (
                        <div
                            className={`absolute inset-0 border-2 border-[#00ff00] rounded-full ${
                                flickerRingIndex === 0 &&
                                message === "ACCESS GRANTED"
                                    ? "animate-vigorous-flicker"
                                    : ""
                            }`}
                        ></div>
                    )}
                    {remainingRings >= 2 && (
                        <div
                            className={`absolute inset-0 m-auto h-[200px] w-[200px] border-2 border-[#00ff00] rounded-full ${
                                flickerRingIndex === 1 &&
                                message === "ACCESS GRANTED"
                                    ? "animate-vigorous-flicker"
                                    : ""
                            }`}
                        ></div>
                    )}
                    {remainingRings >= 1 && (
                        <div
                            className={`absolute inset-0 m-auto h-[100px] w-[100px] border-2 border-[#00ff00] rounded-full ${
                                flickerRingIndex === 2 &&
                                message === "ACCESS GRANTED"
                                    ? "animate-vigorous-flicker"
                                    : ""
                            }`}
                        ></div>
                    )}
                </div>

                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="h-[200px] w-[200px] border-2 border-[#00ff00] rounded-full animate-radar"></div>
                </div>
                {/* Radar sweeping line */}
                <div className="absolute h-[150px] w-[2px] bg-[#00ff00] origin-top animate-sweep top-1/2 shadow-[0_0_10px_2px_#00ff00]"></div>

                {/* Random blinking blips */}
                {[...Array(5)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-2 h-2 bg-[#00ff00] rounded-full animate-blip"
                        style={{
                            top: `${Math.random() * 80 + 10}%`,
                            left: `${Math.random() * 80 + 10}%`,
                        }}
                    ></div>
                ))}
            </div>

            {/* Right container: Displays question prompt, input, hacking animation, and result message */}
            <div className="h-[500px] w-[800px] border-4 border-[#00ff00] bg-black p-4 relative">
                {/* Security Console Header */}
                <div className="absolute top-0 left-0 w-full h-[40px] bg-[#00ff00] flex items-center justify-center">
                    <p className="text-black font-bold tracking-widest text-lg">
                        SECURITY CONSOLE
                    </p>
                </div>

                {firewallsBroken ? (
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 px-6 py-4 border-4 border-[#00ff00] text-xl font-bold text-center bg-black">
                        <p className="text-[#00ff00] animate-pulse">
                            YOU BROKE ALL THREE FIREWALLS!
                        </p>
                    </div>
                ) : (
                    <>
                        {message && (
                            <div
                                className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 px-6 py-4 border-4 ${
                                    messageType === "success"
                                        ? "border-[#00ff00] bg-black text-[#00ff00]"
                                        : "border-red-500 bg-red-900 text-red-400"
                                } text-xl font-bold text-center`}
                            >
                                <p
                                    className={
                                        messageType === "success"
                                            ? "animate-pulse"
                                            : "animate-shake"
                                    }
                                >
                                    {message}
                                </p>
                            </div>
                        )}

                        {isHacking ? (
                            <div className="absolute top-[100px] left-1/2 transform -translate-x-1/2 w-[90%] h-[250px] p-2 overflow-hidden text-[#00ff00] font-mono bg-black">
                                <p className="text-[#00ff00] whitespace-pre-line">
                                    {hackingText}
                                </p>
                            </div>
                        ) : (
                            <div className="relative mt-10">
                                <p className="text-[#00ff00] text-xl mb-4">
                                    {"> "}
                                    {questions[questionIndex]}
                                </p>
                                <div className="flex text-[#00ff00] gap-2 mt-4">
                                    <span>{">"}</span>
                                    <input
                                        type="text"
                                        value={inputValue}
                                        onChange={(e) =>
                                            setInputValue(e.target.value)
                                        }
                                        onKeyDown={handleKeyDown}
                                        className="bg-transparent outline-none w-full text-xl text-[#00ff00]"
                                        autoFocus
                                    />
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default Level3;
