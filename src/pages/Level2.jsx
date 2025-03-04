import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { completeLevel } from "../redux/progressSlice";

const Puzzle = ({ gridSize = 4, imageUrl = "/images/puzzle.png" }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const totalTiles = gridSize * gridSize;
    const initialBoard = Array.from(
        { length: totalTiles },
        (_, i) => (i + 1) % totalTiles
    );

    const alreadySolved = localStorage.getItem("puzzleSolved");
    if(alreadySolved) {
        dispatch(completeLevel("level2"));
    }
    const isSolvable = (arr) => {
        let inversions = 0;
        for (let i = 0; i < arr.length; i++) {
            for (let j = i + 1; j < arr.length; j++) {
                if (arr[i] !== 0 && arr[j] !== 0 && arr[i] > arr[j]) {
                    inversions++;
                }
            }
        }
        if (gridSize % 2 !== 0) {
            return inversions % 2 === 0;
        } else {
            const blankIndex = arr.indexOf(0);
            const rowFromTop = Math.floor(blankIndex / gridSize);
            const rowFromBottom = gridSize - rowFromTop;
            return (
                (rowFromBottom % 2 === 1 && inversions % 2 === 0) ||
                (rowFromBottom % 2 === 0 && inversions % 2 === 1)
            );
        }
    };

    const isSolved = (arr) => {
        return arr.every((val, i) => val === initialBoard[i]);
    };

    const getShuffledBoard = () => {
        let arr = [...initialBoard];
        do {
            arr = arr.sort(() => Math.random() - 0.5);
        } while (!isSolvable(arr) || isSolved(arr));
        return arr;
    };

    const [board, setBoard] = useState(() => {
        const savedBoard = localStorage.getItem("puzzleBoard");
        if (savedBoard) {
            const parsed = JSON.parse(savedBoard);
            if (parsed.length === totalTiles && isSolvable(parsed)) {
                return parsed;
            }
        }
        return getShuffledBoard();
    });

    const [moveCount, setMoveCount] = useState(() => {
        const savedMoveCount = localStorage.getItem("puzzleMoveCount");
        return savedMoveCount ? JSON.parse(savedMoveCount) : 0;
    });

    useEffect(() => {
        localStorage.setItem("puzzleBoard", JSON.stringify(board));
        localStorage.setItem("puzzleMoveCount", JSON.stringify(moveCount));
    }, [board, moveCount]);

    useEffect(() => {
        const savedBoard = localStorage.getItem("puzzleBoard");
        let shouldReset = false;
        if (savedBoard) {
            const parsed = JSON.parse(savedBoard);
            if (parsed.length !== totalTiles) {
                shouldReset = true;
            }
        } else {
            shouldReset = true;
        }
        if (shouldReset) {
            setBoard(getShuffledBoard());
            setMoveCount(0);
        }
    }, [gridSize, totalTiles]);

    const moveTile = (index) => {
        const blankIndex = board.indexOf(0);
        if (isAdjacent(index, blankIndex)) {
            const newBoard = [...board];
            [newBoard[index], newBoard[blankIndex]] = [
                newBoard[blankIndex],
                newBoard[index],
            ];
            setBoard(newBoard);
            setMoveCount((prev) => prev + 1);
            if (isSolved(newBoard)) {
                if (!alreadySolved) {
                    console.log("here")
                    localStorage.setItem("puzzleSolved", "true");
                    const email = localStorage.getItem("userEmail");
                    if (!email) {
                        console.error("User email is missing in localStorage.");
                        return;
                    }
                    const now = new Date();
                    const utcTime =
                        now.getTime() + now.getTimezoneOffset() * 60000;
                    const istTime = new Date(utcTime + 5.5 * 60 * 60000);

                    fetch("http://localhost:5000/api/level2/submit", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            email: email,
                            moves: moveCount + 1,
                            submissionTime: istTime.toISOString(),
                        }),
                    })
                        .then((response) => {
                            if (!response.ok) {
                                throw new Error("Network response was not ok");
                            }
                            return response.json();
                        })
                        .then((data) => {
                            console.log("Puzzle solved data sent:", data);
                        })
                        .catch((error) => {
                            console.error(
                                "Error sending puzzle solved data:",
                                error
                            );
                        });

                    setTimeout(() => alert("Puzzle solved!"), 100);
                    dispatch(completeLevel("level2"));
                    navigate("/level2story");
                }
            }
        }
    };

    const isAdjacent = (index1, index2) => {
        const row1 = Math.floor(index1 / gridSize);
        const col1 = index1 % gridSize;
        const row2 = Math.floor(index2 / gridSize);
        const col2 = index2 % gridSize;
        return Math.abs(row1 - row2) + Math.abs(col1 - col2) === 1;
    };

    return (
        <div
            className="min-h-screen bg-cover bg-center flex items-center justify-center"
            style={{ backgroundImage: 'url("images/backgroundimage.jpg")' }}
        >
            <div className="relative">
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-[600px]">
                        <div className="mb-4 text-center">
                            <span className="text-xl font-bold text-white">
                                Moves: {moveCount}
                            </span>
                        </div>
                        <div
                            className="grid gap-1 rounded-[100px]"
                            style={{
                                gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
                                width: "550px",
                                height: "550px",
                                borderImageSource: "linear-gradient(45deg, #003366, #004080, #336699, #660099, #330066)",
                                borderImageSlice: 1,
                                borderWidth: "8px",
                                boxShadow: "0px 0px 20px rgba(0, 51, 102, 0.8),  0px 0px 30px rgba(0, 102, 204, 0.8), 0px 0px 40px rgba(51, 0, 102, 0.6)",
                            }}
                        >
                            {board.map((value, index) => {
                                const tileStyle =
                                    value !== 0
                                        ? {
                                            backgroundImage: `url(${imageUrl})`,
                                            backgroundSize: `${gridSize * 100
                                                }% ${gridSize * 100}%`,
                                            backgroundPosition: (() => {
                                                const tileIndex = value - 1;
                                                const row = Math.floor(
                                                    tileIndex / gridSize
                                                );
                                                const col =
                                                    tileIndex % gridSize;
                                                return `-${col * 100}% -${row * 100
                                                    }%`;
                                            })(),
                                        }
                                        : {};
                                return (
                                    <div
                                        key={index}
                                        onClick={() => moveTile(index)}
                                        className={`border ${value !== 0
                                                ? "cursor-pointer"
                                                : "bg-gray-200"
                                            }`}
                                        style={{
                                            paddingTop: "100%",
                                            position: "relative",
                                        }}
                                    >
                                        {value !== 0 && (
                                            <div
                                                className="absolute inset-0"
                                                style={tileStyle}
                                            ></div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Puzzle;
