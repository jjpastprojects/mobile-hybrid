app.registerSection("VideoBoard", {
    selectedUnitNumber : null,
    selectedLessonNumber : null,
    bestScoreModel : null,
    attempts : null,
    init : function() {
        
    },
    loadVideoBoard : function() {
        app.utilities.Templates.load("video_board", "video_board_container", {"units" : app.sections.Classroom.units, "course_image" : app.sections.Classroom.courseImage});
        
        
        app.utilities.Templates.load("video_player_controls", "video_player_controls_container", {});
        
        $("#classroom_lesson").hide();
        $("#video_board_container").show();
        app.sections.VideoBoard.loadVideo();
        
    },
    
    showVideoBoard : function() {
           
        //app.classes.GravityBrainQuiz.videoPlayer.pause();
        
        //app.utilities.Templates.load("progress_performance", "progress_performance_container_inner", {"units" : app.sections.Classroom.units});
        app.sections.VideoBoard.createProgressAndPerformance();
        app.sections.VideoBoard.postRenderProgressPerformance();
        app.sections.VideoBoard.selectedUnitNumber = app.sections.Classroom.currentUnit;    
        app.sections.VideoBoard.selectedLessonNumber = app.sections.Classroom.currentLesson;        
        app.sections.VideoBoard.activateUnit();        
        app.sections.VideoBoard.initButtons();        
        $("#video_board").show();
    },
    createProgressAndPerformance : function() {
        var html = "";
        var rows = [];
        var counter = 1;
        
        for(u in app.sections.Classroom.units) {
            html = "";
            html += '<div class="progress_performance_unit " >';
            for(l in app.sections.Classroom.units[u].lessons) {
                html += '<div class="progress_performance_lesson_box ' + app.sections.Classroom.units[u].lessons[l].attempts.status + '"></div>';
            }
            html += "</div>";
            rows[u] = html;            
        }
        html = "";
        for(x in rows) {
            if (x % 3 == 0) {
                if(x != 0) {
                    html += "</div>";    
                } 
                html += "<div class='unit_row' id='unit_row_" + counter + "'  >";                
                counter++;
            }            
            html += rows[x];            
        }
        html += "</div>";
        
        $("#progress_performance_container_inner").html(html);
        
    },
    hideVideoBoard : function() {
        $("#video_board").hide();
    },
    
    postRenderProgressPerformance : function() {
        
    },
    activateUnit : function() {
        var unitId = app.sections.Classroom.units[app.sections.VideoBoard.selectedUnitNumber]['unt_id'];
        $(".unit_box").removeClass("active");
        $("#unit_" + unitId).addClass("active");
        app.sections.VideoBoard.initUnitButtons();
        app.sections.VideoBoard.renderLessonList(); 
    },
    renderLessonList : function() {
        
        app.utilities.Templates.load("lesson_list", "lesson_list_container", {"lessons" : app.sections.Classroom.units[app.sections.VideoBoard.selectedUnitNumber]['lessons']});
        
        app.sections.VideoBoard.initLessonButtons();
        app.sections.VideoBoard.activateLessonBox();
        
    },
    activateLessonBox : function() {
        var _unit = app.sections.Classroom.units[app.sections.VideoBoard.selectedUnitNumber];
        
        var _lesson = _unit['lessons'][app.sections.VideoBoard.selectedLessonNumber];
        var title = "Unit " + _unit['unit_display'] + ", Lesson " + _lesson['lesson_display'];
        var text =  _lesson['description_en_US'];
        
        var lessonId = _lesson['lsn_id'];
        $(".lesson_box").removeClass("active");
        $("#lesson_" + lessonId).addClass("active");

        app.sections.Classroom.getBestGrades(app.sections.Classroom.classroomId, lessonId, app.sections.VideoBoard.getBestGradesHandler);
        
        
        app.utilities.Templates.load("description_container", "description_container", {"unit_id" : _unit['unt_id'], "lesson_id" : lessonId, "title" : title , "text" : text});
        $(".lesson_play_button").unbind(CLICK_EVENT).on(CLICK_EVENT, function() {
                                                                              
            var unitIdClicked = $(this).data("unit-id");
            var lessonIdClicked = $(this).data("lesson-id");
            
            app.sections.Classroom.loadUnitAndQuiz(unitIdClicked, lessonIdClicked);
        });
    },
    getBestGradesHandler : function(response) {
            
        app.sections.VideoBoard.bestScoreModel = new BestGrades("video_board_best_grades_container_inner", response.data.best_grades);
        app.sections.VideoBoard.bestScoreModel.renderBestGrades();
    },
    loadVideo : function() {
        
        app.classes.GravityBrainQuiz.videoPlayer = new VideoPlayer({"container" : VIDEO_CONTAINER, "videos" : app.classes.GravityBrainQuiz.videoFiles, "onEndCallback" : app.sections.VideoBoard.showQuiz, "playControlsContainer" : "video_controls", "onPlay" : app.sections.VideoBoard.playVideo, "onPause" : app.sections.VideoBoard.pauseVideo});
        app.classes.GravityBrainQuiz.videoPlayer.play();
        if(!IS_MOBILE) {
            $("#video_container").unbind(CLICK_EVENT).on(CLICK_EVENT, function() {
                    app.classes.GravityBrainQuiz.videoPlayer.pause();               
                });
        }
        
    },
    pauseVideo : function() {
        //$("#video_player_controls_container").animate({"top" : "640px"}, 1000);
        
        app.sections.VideoBoard.showVideoBoard(); 
    },
    playVideo : function() {
        //$("#video_player_controls_container").animate({"top" : "540px"}, 1000);
        app.sections.VideoBoard.hideVideoBoard();
    },
    
    initUnitButtons : function() {
        $(".unit_box").unbind(CLICK_EVENT).on(CLICK_EVENT, function() {
                var unitId = $(this).data("unit-id");
                app.sections.VideoBoard.selectedUnitNumber = app.sections.Classroom.getUnitNumberById(unitId);
                app.sections.VideoBoard.selectedLessonNumber = 0;
                
                app.sections.VideoBoard.activateUnit();
            });
    },
    initLessonButtons : function() {
        $(".lesson_box").unbind(CLICK_EVENT).on(CLICK_EVENT, function() {
                var lessonId = $(this).data("lesson-id");
                
                app.sections.VideoBoard.selectedLessonNumber = app.sections.Classroom.getLessonNumberById(app.sections.VideoBoard.selectedUnitNumber, lessonId);
                
                app.sections.VideoBoard.activateLessonBox(); 
            });
    },
    initButtons : function() {
        $("#autoguide_button").unbind(CLICK_EVENT).on(CLICK_EVENT, function() {
                    app.api.GravityBrain.getAutoguide({"class_id" : app.sections.Classroom.classroomId}, app.sections.VideoBoard.autoguideHandler);
                });
        $("#view_quiz_button").unbind(CLICK_EVENT).on(CLICK_EVENT, function() {
                app.sections.VideoBoard.showQuiz();
            });
        $("#video_board_stop_quiz_button").unbind(CLICK_EVENT).on(CLICK_EVENT, function() {
                app.sections.Dashboard.load();                                                                    
            });
                                                                            
                                                                                
    },
    showQuiz : function() {
        app.classes.GravityBrainQuiz.videoPlayer.stop();    
        $("#video_board_container").hide();
        $("#classroom_lesson").show();
        app.sections.VideoBoard.hideVideoBoard();
        app.classes.GravityBrainQuiz.loadQuiz();    
    },
    autoguideHandler : function(response) {
        if(response.success) {
            if(response.data.unit_id && response.data.lesson_id) {
                app.sections.VideoBoard.selectedUnitNumber = app.sections.Classroom.getUnitNumberById(response.data.unit_id);
                app.sections.VideoBoard.selectedLessonNumber = app.sections.Classroom.getLessonNumberById(app.sections.VideoBoard.selectedUnitNumber, response.data.lesson_id);
                app.sections.VideoBoard.activateUnit();
            }
        }
    }
    
});