var CONDITION, DEBUG, JUMP_TO_BLOCK, PARAMS, SCORE, STRUCTURE_TRAINING, TRIALS_INNER_REVEALED, TRIALS_TRAINING,
    TRIALS_ACTION, NUM_TRIALS, RANGE_UP, RANGE_LOW, calculateBonus, createStartButton, delay, getActionTrials, getTrainingTrials,
    initializeExperiment, loadTimeout, psiturk, saveData, slowLoad;

DEBUG = true; // change this to false before running the experiment

if (DEBUG) {
    CONDITION = parseInt(window.prompt('condition 0-2', 0));
    NUM_TRIALS = 5;
    //JUMP_TO_BLOCK = window.prompt('skip to block number?', 0);
} else {
    CONDITION = parseInt(condition);
    NUM_TRIALS = 35;
}


JUMP_TO_BLOCK = 0;

TRIALS_TRAINING = void 0;

TRIALS_INNER_REVEALED = void 0;

STRUCTURE_TRAINING = void 0;

SCORE = 50;

BONUS = 0;

MAX_AMOUNT = 5;

calculateBonus = void 0;

getTrainingTrials = void 0;

getActionTrials = void 0;

trialCount = 0;

psiturk = new PsiTurk(uniqueId, adServerLoc, mode);

PARAMS = {
    inspectCost: 1,
    bonusRate: 0.002,
    CODE: ['MEERKAT'],
    startTime: Date(Date.now())
};
//Cond 0: increasing; Cond 1: decreasing; Cond 2: constant
if (CONDITION === 0){
    RANGE_UP = 48;
    RANGE_LOW = -48
} else if (CONDITION === 1){
    RANGE_UP = 67;
    RANGE_LOW = -67
} else {
    RANGE_UP = 30;
    RANGE_LOW = -30
}


saveData = function () {
    return new Promise(function (resolve, reject) {
        var timeout;
        timeout = delay(10000, function () {
            return reject('timeout');
        });
        return psiturk.saveData({
            error: function () {
                clearTimeout(timeout);
                console.log('Error saving data!');
                return reject('error');
            },
            success: function () {
                clearTimeout(timeout);
                console.log('Data saved to psiturk server.');
                return resolve();
            }
        });
    });
};

createStartButton = function () {
    initializeExperiment();
};

$(window).on('beforeunload', function () {
    return 'Are you sure you want to leave?';
});

$(window).resize(function () {
    return checkWindowSize(800, 600, $('#jspsych-target'));
});

$(window).resize();

$(window).on('load', function () {
    // Load data and test connection to server.
    slowLoad = function () {
        var ref;
        return (ref = $('slow-load')) != null ? ref.show() : void 0;
    };
    loadTimeout = delay(12000, slowLoad);
    psiturk.preloadImages(['static/images/spider.png']);
    return delay(300, function () {
        console.log("SELECTED CONDITION", CONDITION);
        STRUCTURE_TRAINING = loadJson('static/json/structure/312.json');
        TRIALS_TRAINING_INCREASING = loadJson('static/json/rewards/train_trials_increasing.json');
        TRIALS_TRAINING_DECREASING = loadJson('static/json/rewards/train_trials_decreasing.json');
        TRIALS_TRAINING_CONSTANT = loadJson('static/json/rewards/train_trials_constant.json');
        TRIALS_TRAINING = [TRIALS_TRAINING_INCREASING, TRIALS_TRAINING_DECREASING, TRIALS_TRAINING_CONSTANT]
        TRIALS_ACTION = loadJson('static/json/demo/312_action.json');
        STRUCTURE = loadJson('static/json/structure/312.json');

        getTrainingTrialsIncreasing = (function () {
            var idx, t;
            t = _.shuffle(TRIALS_TRAINING[0]);
            idx = 0;
            return function (n) {
                idx += n;
                return t.slice(idx - n, idx);
            };
        })();
        getTrainingTrialsDecreasing = (function () {
            var idx, t;
            t = _.shuffle(TRIALS_TRAINING[1]);
            idx = 0;
            return function (n) {
                idx += n;
                return t.slice(idx - n, idx);
            };
        })();
        getTrainingTrialsConstant = (function () {
            var idx, t;
            t = _.shuffle(TRIALS_TRAINING[2]);
            idx = 0;
            return function (n) {
                idx += n;
                return t.slice(idx - n, idx);
            };
        })();

        return saveData().then(function () {
            clearTimeout(loadTimeout);
            return delay(500, createStartButton);
        }).catch(function () {
            clearTimeout(loadTimeout);
            return $('#data-error').show();
        });
    })
})

createStartButton = function () {
    initializeExperiment();
};

initializeExperiment = function () {
    var experiment_timeline
    $('#jspsych-target').html('');
    console.log('INITIALIZE EXPERIMENT');

    let instructions = {
        type: 'instructions',
        on_start: function () {
            return psiturk.finishInstructions(); //started instructions, so no longer worth keeping in database
        },
        show_clickable_nav: true,
        pages: function () {
            return [

                `<h1> Instructions </h1>
<div style="text-align: left">
<li>In this HIT, you will play ${NUM_TRIALS} rounds of the <em>Web of Cash</em> game.</li>
<li>First you will be given the instructions and answer some questions to check your understanding of the game.</li>
<li>The whole HIT will take about 15 minutes.</li>
<li>The better you perform, the higher your bonus will be (up to $5.00!).</li>

</div>

`,
                `<h1> Web of Cash </h1>
<div style="text-align: left">
<li>In this HIT, you will play a game called <em>Web of Cash</em></li>
<li>You will guide a money-loving spider through a spider web with the goal to maximise your score.</li>
<li>Each gray circle (called a <strong><em>node</strong></em>) has its own value.</li>
<li>At the end of each trial, the value of the nodes will be summed up and added to your score.</li>
<li>You will be able to move the spider with the arrow keys, but only in the direction of the arrows between the nodes.</li>
<li>The image below shows the shape of all the webs that you will be navigating in when the game starts.</li>
<img class='display' style="width:50%; height:auto" src='/static/images/web-of-cash.png'/>
</div>

`,
                `<h1> <em>Web of Cash</em> Node Inspector </h1>

<div style="text-align: left">
<li>It's hard to make good decision when you can't see what you will get!</li>
<li>Fortunately, in the <em>Web of Cash</em> game you will have access to a <strong><em>node inspector</strong></em> which can reveal the value of a node.</li>
<li>To use the node inspector, simply <strong><em>click on a node</strong></em>.</li>
<li>The image below illustrates how this works.</li>

<br>
<li><strong>Note:</strong> you can only use the node inspector when you're on the starting
node.</li>

<img class='display' style="width:50%; height:auto" src='static/images/cond_${CONDITION}_example.png'/>
</div>
`,
                `<h1> Rewards and Costs </h1>
<div style="text-align: left">
<!--<li>Each node of the web either contains a reward of up to <strong><font color='green'>$48</font></strong> or a loss of up to <strong><font color='red'>$-48</font></strong></li>-->
<li>Each node of the web either contains a reward of up to <strong><font color='green'>$${RANGE_UP}</font></strong> or a loss of up to <strong><font color='red'>$${RANGE_LOW}</font></strong></li>
<li>You can find out about a node's loss or reward by using the node inspector, which costs <strong>$1 per click.</strong></li>
<li>After each round your total score will be calculated, which is the sum of the reward or loss of each node that you have passed on your route, and added to your current score.</li>
<li>You will start with a score of $50.</li>

</div>

`,

                `<h1> Additional Information </h1>

<div style="text-align: left">
<li>There will be ${NUM_TRIALS} trials and on every round the rewards behind each node will be different. So you have to make a new plan every time</li>
<li>Practice makes perfect! You can get better at planning through practice.</li>
<li>You will receive a base pay of $1.50 regardless of your performance.</li>
<li>Your bonus depends on your performance. The more money the spider gets, the bigger your bonus will be!</li>
</div>`,
                `<h1> Quiz </h1>

Before you can begin playing the <em>Web of Cash</em>, you must pass the quiz to show that you understand the rules. 
If you get any of the questions incorrect, you will be brought back to the instructions to review and try the quiz again.`
            ];
        }
    };
    let quiz = {
        preamble: function () {
            return `<h1> Quiz </h1>
`;
        },
        type: 'survey-multi-choice',
        questions: [
            {
                prompt: "What is the range of node values?",
                options: ['$0 to $50',
                    '$-30 to $30',
                    '$-48 to $48',
                    '$-67 to $67'],
                horizontal: false,
                required: true
            },
            {
                prompt: "What is the cost of clicking on a node to find out its value?",
                options: ['$0', '$1', '$5', '$10'],
                horizontal: false,
                required: true
            },
            {
                prompt: "Will you receive a bonus?",
                options: ['No.',
                    'I will receive a $1 bonus regardless of my performance.',
                    'I will receive a $1 bonus if I perform well, otherwise I will receive no bonus.',
                    'The better I perform the higher my bonus will be.'],
                horizontal: false,
                required: true
            },
            {
                prompt: "Will each round be the same?",
                options: ['Yes.',
                    'No, the amount of cash at each node of the web may be different each time.',
                    'No, the structure of the web will be different each time.'],
                horizontal: false,
                required: true
            },
        ],
        data: {
            correct: {
                Q0: function() {
                    if (CONDITION===0) {
                        return '$-48 to $48'
                    } else if (CONDITION===1) {
                        return '$-67 to $67'
                    } else {
                        return '$-30 to $30'
                    }},
                Q1: '$1',
                Q2: 'The better I perform the higher my bonus will be.',
                Q3: 'No, the amount of cash at each node of the web may be different each time.',
            }
        }
    };
    let instruct_loop = {
        timeline: [instructions, quiz],
        loop_function: function (data) {
            var resp_id, response, responses;
            responses = data.last(1).values()[0].response;
            for (resp_id in responses) {
                response = responses[resp_id];
                if (!(data.last(1).values()[0].correct[resp_id] === response)) {
                    alert(`You got at least one question wrong. We'll send you back to the instructions and then you can try again.`);
                    return true; // try again
                }
            }
            psiturk.saveData();
            return false;
        }
    };

    let demographics = {
        type: 'survey-html-form',
        preamble: "<h1>Demographics</h1> <br> Thanks for participating. We hope you had fun! Please answer the following questions.",
        html: `<div style="text-align: left"> <p>
  <strong>What is your gender?</strong><br>
  <input required type="radio" name="gender" value="male"> Male<br>
  <input required type="radio" name="gender" value="female"> Female<br>
  <input required type="radio" name="gender" value="other"> Other<br>
</p>
<br>
<p>
  <strong>How old are you?</strong><br>
  <input required type="number" name="age">
</p>
<br>
<p>
  <strong>Are you colorblind?</strong><br>
  <input required type="radio" name="colorblind" value="0"> No<br>
  <input required type="radio" name="colorblind" value="1"> Yes<br>
  <input required type="radio" name="colorblind" value="2"> Don't know<br>
</p>
<br>
<p>
  <strong>Since we are doing science, we would now like to know how much attention/effort you put into the game and any surveys. <br><em>(Please note that, even if you answer \'No effort\', it will not affect your pay in anyway and we will not exclude you from future studies based on this response. It will just enable us to do our data analysis better. <strong> We value your time! </strong>)</em><br></strong>
  <input required type="radio" name="effort" value="0"> A lot of effort (e.g. paying full attention throughout, trying to get a high score in the <em> Web of Cash </em>)<br>
  <input required type="radio" name="effort" value="1"> Some effort (e.g. mostly paying attention, listening to music or a podcast)<br>
  <input required type="radio" name="effort" value="2"> Minimal effort (e.g. watching TV and not always looking at the screen, just trying to get through the <em> Web of Cash </em> trials)<br>
  <input required type="radio" name="effort" value="3"> No effort (e.g. randomly clicking)<br>
  <input required type="radio" name="effort" value="4"> Unsure<br>
</p><\div>`
    };
    let training_trial_increasing = {
        type: 'mouselab-mdp',
        blockName: 'training',
        stateDisplay: 'click', // one of 'never', 'hover', 'click', 'always'
        stateClickCost: function () {
            return 1;
        },
        timeline: (function () {
            return getTrainingTrialsIncreasing(NUM_TRIALS);
        })(),
        // startScore: 50,
        //centerMessage: 'Demo trial',
        playerImageScale: 0.3,
        size: 120, // determines the size of states, text, etc...
        playerImage: 'static/images/spider.png',

        lowerMessage: `Click on the nodes to reveal their values.<br>
Move with the arrow keys.`,
        graph: STRUCTURE.graph,
        layout: STRUCTURE.layout,
        initial: STRUCTURE.initial,
        num_trials: NUM_TRIALS,
        trialCount: function () {
            return trialCount;
        },
        on_finish: function () {
            return trialCount += 1;
        }
    };
    let training_trial_decreasing = {
        type: 'mouselab-mdp',
        blockName: 'training',
        stateDisplay: 'click', // one of 'never', 'hover', 'click', 'always'
        stateClickCost: function () {
            return 1;
        },
        timeline: (function () {
            return getTrainingTrialsDecreasing(NUM_TRIALS);
        })(),
        // startScore: 50,
        //centerMessage: 'Demo trial',
        playerImageScale: 0.3,
        size: 120, // determines the size of states, text, etc...
        playerImage: 'static/images/spider.png',

        lowerMessage: `Click on the nodes to reveal their values.<br>
Move with the arrow keys.`,
        graph: STRUCTURE.graph,
        layout: STRUCTURE.layout,
        initial: STRUCTURE.initial,
        num_trials: NUM_TRIALS,
        trialCount: function () {
            return trialCount;
        },
        on_finish: function () {
            return trialCount += 1;
        }
    };
    let training_trial_constant = {
        type: 'mouselab-mdp',
        blockName: 'training',
        stateDisplay: 'click', // one of 'never', 'hover', 'click', 'always'
        stateClickCost: function () {
            return 1;
        },
        timeline: (function () {
            return getTrainingTrialsConstant(NUM_TRIALS);
        })(),
        // startScore: 50,
        //centerMessage: 'Demo trial',
        playerImageScale: 0.3,
        size: 120, // determines the size of states, text, etc...
        playerImage: 'static/images/spider.png',

        lowerMessage: `Click on the nodes to reveal their values.<br>
Move with the arrow keys.`,
        graph: STRUCTURE.graph,
        layout: STRUCTURE.layout,
        initial: STRUCTURE.initial,
        num_trials: NUM_TRIALS,
        trialCount: function () {
            return trialCount;
        },
        on_finish: function () {
            return trialCount += 1;
        }
    };
    let finish = {
        type: 'survey-text',
        preamble: function () {
            return `<h1> You've completed the HIT </h1>

Based on your performance, you will be awarded a total bonus of <strong>$${calculateBonus().toFixed(2)}</strong>.

Please briefly answer the questions below before you submit the HIT.`;
        },
        on_finish: function() {
            return BONUS = calculateBonus().toFixed(2);
        },
        questions: [
            {
                prompt: 'Was anything confusing or hard to understand?',
                required: false,
                rows: 3
            },
            {
                prompt: "What have you learned? What are you doing differently now from what you were doing at the beginning of this HIT?",
                required: true,
                rows: 3
            },
            {
                prompt: 'Additional comments?',
                required: false,
                rows: 3
            }
        ],
        button_label: 'Submit and continue to the secret code'
    };
    let secret_code_trial = {
        type: 'html-button-response',
        choices: ['Finish HIT'],
        stimulus: function () {
            return "The secret code is <strong>" + PARAMS.CODE + "</strong>. Please press the 'Finish HIT' button once you've copied it down to paste in the original window.";
        }
    };


    if (CONDITION === 0) {
        experiment_timeline = [instruct_loop, training_trial_increasing, demographics, finish];
    } else if (CONDITION === 1) {
        experiment_timeline = [instruct_loop, training_trial_decreasing, demographics, finish];
    } else if (CONDITION === 2) {
        experiment_timeline = [instruct_loop, training_trial_constant, demographics, finish];
    }


// ================================================ #
// ========= START AND END THE EXPERIMENT ========= #
// ================================================ #

// experiment goes to full screen at start
//     experiment_timeline.unshift({
//         type: "fullscreen",
//         message: '<p>The experiment will switch to full screen mode when you press the button below.<br> Please do not leave full screen for the duration of the experiment. </p>',
//         button_label: 'Continue',
//         fullscreen_mode: true,
//         delay_after: 1000
//     });
// at end, show the secret code and then leave fullscreen

    experiment_timeline.push(secret_code_trial);
    // experiment_timeline.push({
    //     type: "fullscreen",
    //     fullscreen_mode: false,
    //     delay_after: 1000
    // });
// bonus is the (roughly) total score multiplied by something, bounded by min and max amount
    calculateBonus = function () {
        var bonus;
        bonus = SCORE * PARAMS.bonusRate;
        bonus = (Math.round(bonus * 100)) / 100; // round to nearest cent
        return Math.min(Math.max(0, bonus), MAX_AMOUNT);
    };
//saving, finishing functions
    reprompt = null;
    save_data = function () {
        return psiturk.saveData({
            success: async function () {
                console.log('Data saved to psiturk server.');
                if (reprompt != null) {
                    window.clearInterval(reprompt);
                }
                await completeExperiment(uniqueId); // Encountering an error here? Try to use Coffeescript 2.0 to compile.
                psiturk.completeHIT();
                return psiturk.computeBonus('compute_bonus');
            },
            error: function () {
                return prompt_resubmit;
            }
        });
    };
    prompt_resubmit = function () {
        $('#jspsych-target').html(`<h1>Oops!</h1>
<p>
Something went wrong submitting your HIT.
This might happen if you lose your internet connection.
Press the button to resubmit.
</p>
<button id="resubmit">Resubmit</button>`);
        return $('#resubmit').click(function () {
            $('#jspsych-target').html('Trying to resubmit...');
            reprompt = window.setTimeout(prompt_resubmit, 10000);
            return save_data();
        });
    };
// initialize jspsych experiment -- without this nothing happens
    return jsPsych.init({
        display_element: 'jspsych-target',
        timeline: experiment_timeline,
        // show_progress_bar: true
        on_finish: function () {
            if (DEBUG) {
                psiturk.recordUnstructuredData('final_bonus', calculateBonus());
                return save_data();
            } else {
                // BONUS = calculateBonus().toFixed(2)
                psiturk.recordUnstructuredData('final_bonus', calculateBonus());
                // psiturk.recordUnstructuredData('displayed_bonus', BONUS);
                return save_data();
            }
        },
        on_data_update: function (data) {
            // console.log 'data', data
            psiturk.recordTrialData(data);
            return psiturk.saveData();
        }
    });
};
