var mongoose     = require("mongoose"),
    Campground   = require("./models/campground"),
    Comment      = require("./models/comment");

var data = [
    {
        name: "Some Creek",
        image:"http://visitmckenzieriver.com/oregon/wp-content/uploads/2015/06/paradise_campground.jpg",
        description:"No water. Beware of Bisons. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam volutpat, felis ac vestibulum ultrices, quam orci posuere sapien, quis dignissim massa quam in nunc. Quisque ultricies congue neque, quis tristique turpis accumsan ultrices. Sed odio enim, ullamcorper sed euismod non, auctor eget dolor. Nunc dapibus libero euismod neque dapibus, in sodales nibh facilisis. Praesent non mauris eu lectus facilisis scelerisque. Integer tincidunt, neque quis aliquam venenatis, mauris justo pulvinar tortor, at cursus quam velit et dolor. Suspendisse tempor odio vitae convallis dapibus. Pellentesque in felis diam. Cras efficitur venenatis blandit."
    },{
        name: "Some Lake",
        image:"https://www.pc.gc.ca/en/pn-np/ab/banff/activ/camping/~/media/802FD4AF791F4C6886E18CBF4A2B81B2.ashx?w=595&h=396&as=1",
        description:"We can't be held responsible for bodily harm. Phasellus tempus metus non magna gravida, in imperdiet mi suscipit. Maecenas sed eleifend ex. Quisque hendrerit cursus neque, tristique aliquam lectus. Nullam congue suscipit vulputate. Nullam sit amet hendrerit enim. Vivamus at mollis enim. Morbi suscipit viverra varius. Pellentesque pretium ipsum velit, in tristique erat tempor non. Quisque vestibulum quam consequat lectus euismod dictum. Etiam ullamcorper, nisi ac iaculis ultrices, mauris libero auctor mi, quis viverra tellus neque in ex. Integer eu nisl vel tellus aliquet auctor. Nulla et mattis quam. Vivamus a turpis at arcu tempus consectetur ut id sem."
    },{
        name: "Some Woods",
        image:"https://www.nhstateparks.org/uploads/images/Dry-River_Campground_02.jpg",
        description:"No harvesting firewood, no going to the bathroom. Suspendisse ex sapien, fringilla eu ligula eu, malesuada sagittis velit. Suspendisse non tellus eu magna facilisis tempus. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Morbi quis risus non lorem ultrices rutrum. Proin sed convallis tortor. Aenean volutpat lorem fermentum felis tristique feugiat. Aliquam laoreet pulvinar nisi, sed sagittis nunc sollicitudin vel. Nam laoreet nisl dui, sed commodo magna accumsan vel. Nunc vel quam ipsum. Morbi purus purus, feugiat et elit sed, sollicitudin elementum tellus."
    }
];

function seedDB(){
    //Remove all campgrounds
    Campground.remove({}, function(err){
        if(err){
            console.log(err);
        } else {
            console.log("removed campgrounds!");
            //Remove all comments
            Comment.remove({},function(err){
                if(err){
                    console.log(err);
                } else {
                    console.log("removed comments!");
                    //Add a few campgrounds
                    data.forEach(function(seed){
                      Campground.create(seed,function(err, campground){
                            if(err){
                                console.log(err);
                            } else {
                                console.log("added a campground");
                                //Add a few comments
                                Comment.create(
                                    {
                                        text: "Horrible place, no internet",
                                        author: "Homer"
                                    }, function(err, comment){
                                        if(err){
                                            console.log(err);
                                        } else {
                                            campground.comments.push(comment);
                                            campground.save();
                                            console.log("created a comment");
                                        }
                                    }
                                );
                            } 
                      });
                    });    
                }
            });
        }
    });
} 

module.exports = seedDB;