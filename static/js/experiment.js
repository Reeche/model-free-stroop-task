// Generated by CoffeeScript 2.5.1
// coffeelint: disable=max_line_length, indentation
var CONDITION, DEBUG, JUMP_TO_BLOCK, PARAMS, SCORE, STRUCTURE_TRAINING, TRIALS_INNER_REVEALED, TRIALS_TRAINING,
    TRIALS_ACTION,
    calculateBonus, createStartButton, delay, getActionTrials, getTrainingTrialsIncreasing, getTrainingTrialsDecreasing,
    getTrainingTrialsConstant, getTrialsWithInnerRevealed,
    initializeExperiment, loadTimeout, psiturk, saveData, slowLoad;

DEBUG = true; // change this to false before running the experiment

CONDITION = parseInt(condition);
//CONDITION = 0; // 0 or 1

JUMP_TO_BLOCK = 0;

TRIALS_TRAINING = void 0;

TRIALS_TRAINING = void 0;

TRIALS_INNER_REVEALED = void 0;

STRUCTURE_TRAINING = void 0;

SCORE = 0;

calculateBonus = void 0;

getTrainingTrials = void 0;

getTrialsWithInnerRevealed = void 0;

getActionTrials = void 0;

PARAMS = {
    inspectCost: 1,
    bonusRate: 0.002
};

_.mapObject = mapObject;

psiturk = new PsiTurk(uniqueId, adServerLoc, mode);

delay = function (time, func) {
    return setTimeout(func, time);
};

slowLoad = function () {
    var ref;
    return (ref = $('slow-load')) != null ? ref.show() : void 0;
};

loadTimeout = delay(12000, slowLoad);

// if (DEBUG) {
//     CONDITION = parseInt(window.prompt('condition 0-2', 0));
//     //JUMP_TO_BLOCK = window.prompt('skip to block number?', 0);
// }

createStartButton = function () {
    document.getElementById('loader').style.display = 'none';
    document.getElementById('successLoad').style.display = 'block';
    document.getElementById('failLoad').style.display = 'none';
    return $('#load-btn').click(initializeExperiment);
};

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
        console.log('Loading data');
        STRUCTURE_TRAINING = loadJson('static/json/structure/312.json');
        TRIALS_TRAINING_INCREASING = loadJson('static/json/rewards/train_trials_increasing.json');
        TRIALS_TRAINING_DECREASING = loadJson('static/json/rewards/train_trials_decreasing.json');
        TRIALS_TRAINING_CONSTANT = loadJson('static/json/rewards/train_trials_constant.json');
        TRIALS_TRAINING = [TRIALS_TRAINING_INCREASING, TRIALS_TRAINING_DECREASING, TRIALS_TRAINING_CONSTANT]
        TRIALS_ACTION = loadJson('static/json/demo/312_action.json');
        //TRIALS_INNER_REVEALED = loadJson('static/json/demo/312_inner_revealed.json');
        console.log(`loaded ${TRIALS_TRAINING != null ? TRIALS_TRAINING.length : void 0} training trials`);
        getTrainingTrialsIncreasing = (function () {
            // randomly choose one object out of the array
            //random = Math.floor(Math.random() * TRIALS_TRAINING.length);
            //console.log(" ----- Selected condition  -----", random)
            // 1 is decreasing, 0 is increasing, 2 is constant
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
        getTrialsWithInnerRevealed = (function () {
            var idx, t;
            t = _.shuffle(TRIALS_INNER_REVEALED);
            idx = 0;
            return function (n) {
                idx += n;
                return t.slice(idx - n, idx);
            };
        })();
        getActionTrials = (function () {
            var idx, t;
            t = _.shuffle(TRIALS_ACTION);
            idx = 0;
            return function (n) {
                idx += n;
                return t.slice(idx - n, idx);
            };
        })();
        console.log('Testing saveData');
        return saveData().then(function () {
            clearTimeout(loadTimeout);
            return delay(500, createStartButton);
        }).catch(function () {
            clearTimeout(loadTimeout);
            return $('#data-error').show();
        });
    });
});

createStartButton = function () {
    initializeExperiment();
    $('#load-icon').hide();
    $('#slow-load').hide();
    $('#success-load').show();
    return $('#load-btn').click(initializeExperiment);
};

initializeExperiment = function () {
    var Block, ButtonBlock, MouselabBlock, QuizLoop, TextBlock, demo_trial, divider, experiment_timeline, finish,
        instructions, divider_training_test, prompt_resubmit, quiz, reprompt, reset_score, save_data, survey,
        text, training_no_FB, training_with_actions_FB, instruct_loop,
        training_with_inner_revealed, training_with_optimal_FB, welcome, training_trial_decreasing,
        training_trial_increasing,
        training_trial_constant;
    $('#jspsych-target').html('');
    console.log('INITIALIZE EXPERIMENT');
    text = '';
    // ================================= #
    // ========= BLOCK CLASSES ========= #
    // ================================= #
    Block = class Block {
        constructor(config) {
            _.extend(this, config);
            this._block = this; // allows trial to access its containing block for tracking state
            if (this._init != null) {
                this._init();
            }
        }

    };
    TextBlock = (function () {
        class TextBlock extends Block {
        };

        TextBlock.prototype.type = 'text';

        TextBlock.prototype.cont_key = [];

        return TextBlock;

    }).call(this);
    ButtonBlock = (function () {
        class ButtonBlock extends Block {
        };

        ButtonBlock.prototype.type = 'button-response';

        ButtonBlock.prototype.is_html = true;

        ButtonBlock.prototype.choices = ['Continue'];

        ButtonBlock.prototype.button_html = '<button class="btn btn-primary btn-lg">%choice%</button>';

        return ButtonBlock;

    }).call(this);
    QuizLoop = class QuizLoop extends Block {
        loop_function(data) {
            var c, i, len, ref;
            console.log('data', data);
            ref = data[data.length].correct;
            for (i = 0, len = ref.length; i < len; i++) {
                c = ref[i];
                if (!c) {
                    return true;
                }
            }
            return false;
        }

    };
    MouselabBlock = (function () {
        class MouselabBlock extends Block {
        };

        MouselabBlock.prototype.type = 'mouselab-mdp';

        MouselabBlock.prototype.playerImage = 'static/images/spider.png';

        MouselabBlock.prototype.lowerMessage = `<b>Clicking on a node reveals its value for a $1 fee.<br>
Move with the arrow keys.</b>`;

        return MouselabBlock;

    }).call(this);
    QuizLoop = class QuizLoop extends Block {
        loop_function(data) {
            var c, i, len, ref;
            //console.log('data', data);
            ref = data[data.length].correct;
            for (i = 0, len = ref.length; i < len; i++) {
                c = ref[i];
                if (!c) {
                    return true;
                }
            }
            return false;
        }

    };
    //  ============================== #
    //  ========= EXPERIMENT ========= #
    //  ============================== #
    welcome = new TextBlock({
        text: function () {
            return `<h1>Mouselab-MDP Demo</h1>

<p>
  This is a demonstration of the Mouselab-MDP plugin.
</p>
<p>
  Press <b>space</b> to continue.
</p>`;
        }
    });
    finish = new Block({
        type: 'survey-text',
        preamble: function () {
            return markdown(`# You've completed the HIT

Thanks for participating. 
\n We hope you had fun! Based on your
performance, you will be awarded a bonus of
**$${calculateBonus().toFixed(2)}** on top of your base pay of $1.50. 
\n
Please briefly answer the questions below before you submit the HIT.`);
        },
        //'How did you go about planning the path of the spider?'
        //'Did you learn anything about how to plan better?'
        questions: ['How old are you?', 'Which gender do you identify with?', 'Do you have additional comments?'],
        rows: [4, 4, 1, 1],
        button: 'Submit HIT'
    });
    //     reset_score = new Block({
    //         type: 'call-function',
    //         func: function () {
    //             return SCORE = 0;
    //         }
    //     });
    //     divider = new TextBlock({
    //         text: function () {
    //             SCORE = 0;
    //             return "<div style='text-align: center;'> Press <code>space</code> to continue.</div>";
    //         }
    //     });

    instructions = new Block({
        type: 'instructions',
        show_clickable_nav: true,
        pages: function () {
            return [markdown(" <h1> Web of Cash </h1>\n\n In this HIT, you will play a game called *Web of Cash*. You will guide a\n money-loving spider through a spider web. " +
                "Each gray circle\n (called a ***node***) has its own value. At the end of each trial, the value of the nodes will be summed up and added to your score. " +
                "\n\n You will be able to move the spider with the arrow keys, " +
                "but only in the direction\n of the arrows between the nodes. The image below shows the web that you will be navigating when the game starts." +
                "\n\n<img class='display' style=\"width:50%; height:auto\" src='static/images/web-of-cash-unrevealed.png'/>\n"),
                markdown("## Node Inspector\n\nIt's hard to make good decision when you can't see what you will get!\nFortunately, " +
                    "you will have access to a ***node inspector*** which can reveal\nthe value of a node. To use the node inspector, " +
                    "simply ***click on a node***. The image below illustrates how this works.\n\n**Note:** You can only use the node inspector when you're on the first\nnode." +
                    "\n\n<img class='display' style=\"width:50%; height:auto\" src='static/images/web-of-cash.png'/>\n\n"),
                markdown("## Rewards and Costs\n- Each node of the web either contains a reward of up to <b><font color='green'>$48</font></b> or a loss of up to <b><font color='red'>$-48</font></b>" +
                    "\n- You can find out about a node's loss or reward by using the node inspector.\n- The fee for using the node inspector is <b>$1 per click</b>. " +
                    "\n- After each round your total score will be calculated, which is the sum of the reward or loss of each node that you have passed on your route." +
                    "\n\n- You will start with **$50**"),
                markdown("## Additional Information\n\n<img class='display' style=\"width:50%; height:auto\" src='static/images/web-of-cash.png'/>" +
                    "\n- There will be 35 rounds and on every round the rewards on the web will be different. " +
                    "So you have to make a new plan every time.\n"),
                markdown(`## Practice makes perfect\n\n- You can get better at planning through practice.
            \n- You will receive a base pay of $1.50 and the better you perform, the higher your bonus will be.
            \n`), markdown("## Quiz\n\nBefore you can begin playing *Web of Cash*, you must pass a quiz to show\nthat you understand the rules. If you get any of the questions" +
                    "\nincorrect, you will be brought back to the instructions to review and\ntry the quiz again.")];
        }
    });

    survey = new Block({
        type: 'survey-text',
        preamble: function () {
            return markdown(`# Just one question ...
`);
        },
        questions: ['What have you learned? What are you doing differently now from what you were doing at the beginning of this HIT?'],
        button: 'Finish'
    });
    quiz = new Block({
        preamble: function () {
            return markdown(`# Quiz

Please answer the following questions about the *Web of Cash* game.
`);
        },
        type: 'survey-multi-choice',
        questions: ["What is the range of node values?", "What is the cost of clicking on a node to find out its value?", "Will each round be the same?"],
        options: [['$0 to $50', '$-10 to $10', '$-48 to $48', '$-100 to $100'], ['$0', '$1', '$5', '$10'], ['Yes.', 'No, the amount of cash at each node of the web may be different each time.', 'No, the structure of the web will be different each time.']],
        required: [true, true, true],
        correct: ['$-48 to $48', '$1', 'No, the amount of cash at each node of the web may be different each time.']
    });
    instruct_loop = new Block({
        timeline: [instructions, quiz],
        loop_function: function (data) {
            var c, i, len, ref;
            ref = data[1].correct;
            for (i = 0, len = ref.length; i < len; i++) {
                c = ref[i];
                if (!c) {
                    alert("You got at least one question wrong. We'll send you back to the\ninstructions and then you can try again.");
                    return true; // try again
                }
            }
            psiturk.finishInstructions();
            psiturk.saveData();
            return false;
        }
    });
    training_trial_increasing = new MouselabBlock({
        show_feedback: false,
        blockName: 'training',
        stateDisplay: 'click', // one of 'never', 'hover', 'click', 'always'
        stateClickCost: 1, // subtracted from score every time a state is clicked
        timeline: (function () {
            return getTrainingTrialsIncreasing(3);
        })(),
        startScore: 50,
        //centerMessage: 'Demo trial',
        playerImageScale: 0.3,
        size: 120, // determines the size of states, text, etc...
        _init: function () {
            _.extend(this, STRUCTURE_TRAINING);
            //this.playerImage = 'static/images/plane.png';
            return this.trialCount = 0;
        }
    });
    training_trial_decreasing = new MouselabBlock({
        show_feedback: false,
        blockName: 'training',
        stateDisplay: 'click', // one of 'never', 'hover', 'click', 'always'
        stateClickCost: 1, // subtracted from score every time a state is clicked
        timeline: (function () {
            return getTrainingTrialsDecreasing(3);
        })(),
        startScore: 50,
        //centerMessage: 'Demo trial',
        playerImageScale: 0.3,
        size: 120, // determines the size of states, text, etc...
        _init: function () {
            _.extend(this, STRUCTURE_TRAINING);
            //this.playerImage = 'static/images/plane.png';
            return this.trialCount = 0;
        }
    });
    training_trial_constant = new MouselabBlock({
        show_feedback: false,
        blockName: 'training',
        stateDisplay: 'click', // one of 'never', 'hover', 'click', 'always'
        stateClickCost: 1, // subtracted from score every time a state is clicked
        timeline: (function () {
            return getTrainingTrialsConstant(3);
        })(),
        startScore: 50,
        //centerMessage: 'Demo trial',
        playerImageScale: 0.3,
        size: 120, // determines the size of states, text, etc...
        _init: function () {
            _.extend(this, STRUCTURE_TRAINING);
            //this.playerImage = 'static/images/plane.png';
            return this.trialCount = 0;
        }
    });


    // training_no_FB = new MouselabBlock({
    //     minTime: 7,
    //     show_feedback: false,
    //     blockName: 'training',
    //     stateDisplay: 'click',
    //     stateClickCost: PARAMS.inspectCost,
    //     timeline: getTrainingTrials(2),
    //     startScore: 50,
    //     centerMessage: 'No feedback',
    //     _init: function () {
    //         _.extend(this, STRUCTURE_TRAINING);
    //         this.playerImage = 'static/images/plane.png';
    //         return this.trialCount = 0;
    //     }
    // });
    // training_with_actions_FB = new MouselabBlock({
    //     minTime: 7,
    //     show_feedback: false,
    //     blockName: 'training',
    //     stateDisplay: 'click',
    //     stateClickCost: PARAMS.inspectCost,
    //     timeline: getActionTrials(2),
    //     startScore: 50,
    //     centerMessage: 'Actions feedback',
    //     _init: function () {
    //         _.extend(this, STRUCTURE_TRAINING);
    //         this.playerImage = 'static/images/plane.png';
    //         return this.trialCount = 0;
    //     }
    // });
    // training_with_optimal_FB = new MouselabBlock({
    //     minTime: 7,
    //     show_feedback: true,
    //     blockName: 'training',
    //     stateDisplay: 'click',
    //     stateClickCost: PARAMS.inspectCost,
    //     timeline: getTrainingTrials(2),
    //     startScore: 50,
    //     centerMessage: 'Optimal feedback',
    //     _init: function () {
    //         _.extend(this, STRUCTURE_TRAINING);
    //         this.playerImage = 'static/images/plane.png';
    //         return this.trialCount = 0;
    //     }
    // });
    // training_with_inner_revealed = new MouselabBlock({
    //     minTime: 7,
    //     show_feedback: false,
    //     blockName: 'training',
    //     stateDisplay: 'click',
    //     stateClickCost: PARAMS.inspectCost,
    //     timeline: getTrialsWithInnerRevealed(2),
    //     startScore: 50,
    //     centerMessage: 'Inner nodes revealed',
    //     _init: function () {
    //         _.extend(this, STRUCTURE_TRAINING);
    //         this.playerImage = 'static/images/plane.png';
    //         return this.trialCount = 0;
    //     }
    // });

    // here you set which experiments snippets will be run
    console.log("SELECTED CONDITION", CONDITION)
    if (DEBUG) {
        if (CONDITION === 0) {
            experiment_timeline = [training_trial_increasing];
        } else if (CONDITION === 1) {
            experiment_timeline = [training_trial_decreasing];
        } else if (CONDITION === 2) {
            experiment_timeline = [training_trial_constant];
        }
    } else {
        if (CONDITION === 0) {
            experiment_timeline = [instruct_loop, training_trial_increasing, survey, finish];
        } else if (CONDITION === 1) {
            experiment_timeline = [instruct_loop, training_trial_decreasing, survey, finish];
        } else if (CONDITION === 2) {
            experiment_timeline = [instruct_loop, training_trial_constant, survey, finish];
        }
    }


    experiment_timeline = experiment_timeline.slice(JUMP_TO_BLOCK);

    flatten_timeline = function (timeline) {
        var global_timeline = [];

        for (var i in timeline) {
            t = timeline[i];

            if (t.timeline !== undefined) {
                //recursive for sub timelines
                global_timeline.push(flatten_timeline(t.timeline));
            } else {
                // its a real block
                if (t.type !== undefined) {
                    info = t.type;

                    //if(t.questions !== undefined){
                    //info = info + ' : ' + t.questions.toString();
                    //}
                    global_timeline.push(info);

                } else if (t.trial_id !== undefined) {
                    global_timeline.push('Mouselab : ' + t.trial_id)
                }

            }
        }
        global_timeline = [global_timeline.flat(1)];
        return (global_timeline);
    }
    psiturk.recordUnstructuredData('global_timeline', JSON.stringify(flatten_timeline(experiment_timeline)));
    //console.log( JSON.stringify(flatten_timeline(experiment_timeline)) );

    // ================================================ #
    // ========= START AND END THE EXPERIMENT ========= #
    // ================================================ #
    calculateBonus = function () {
        var bonus;
        //console.log("Score", SCORE);
        //console.log("bonus rate", PARAMS.bonusRate);
        bonus = SCORE * PARAMS.bonusRate;
        //console.log("Bonus 1", bonus);
        bonus = (Math.round(bonus * 100)) / 100; // round to nearest cent
        //console.log("Bonus 2", bonus);
        return Math.max(0, bonus);
    };
    reprompt = null;
    save_data = function () {
        return psiturk.saveData({
            success: function () {
                console.log('Data saved to psiturk server.');
                if (reprompt != null) {
                    window.clearInterval(reprompt);
                }
                return psiturk.completeHIT();
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
    return jsPsych.init({
        display_element: $('#jspsych-target'),
        timeline: experiment_timeline,
        // show_progress_bar: true
        on_finish: function () {
            if (DEBUG) {
                console.log('final_bonus', SCORE)
                psiturk.recordUnstructuredData('final_bonus', calculateBonus());
                return save_data();
                //return jsPsych.data.displayData();
            } else {
                psiturk.recordUnstructuredData('final_bonus', calculateBonus());
                return save_data();
            }
        },
        on_data_update: function (data) {
            console.log('data', data);
            return psiturk.recordTrialData(data);
        }
    });
};