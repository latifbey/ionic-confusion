import { Component, Inject } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, ActionSheetController, ModalController } from 'ionic-angular';


import { Dish } from '../../shared/dish';
import { CommentPage } from '../comment/comment';
import { FavoriteProvider } from '../../providers/favorite/favorite';


/**
 * Generated class for the DishdetailPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-dishdetail',
  templateUrl: 'dishdetail.html',
})
export class DishdetailPage {
  dish: Dish;
  errMess: string;
  avgstars: string;
  numcomments: number;
  favorite: boolean;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    
    @Inject('BaseURL') private BaseURL,
    private toastCtrl: ToastController,
    private actionSheetCtrl: ActionSheetController,
    private modalCtrl: ModalController,
    private favoriteservice: FavoriteProvider) {
    this.dish = navParams.get('dish');
    this.favorite = favoriteservice.isFavorite(this.dish.id);
    this.numcomments = this.dish.comments.length;
    let total = 0;
    this.dish.comments.forEach(comment => total += comment.rating );
    this.avgstars = (total/this.numcomments).toFixed(2);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DishdetailPage');
  }
  
  addToFavorites() {
    console.log('Adding to Favorites', this.dish.id);
    this.favorite = this.favoriteservice.addFavorite(this.dish.id);
    this.toastCtrl.create({
      message: 'Dish ' + this.dish.id + ' added as favorite successfully',
      position: 'middle',
      duration: 3000}).present();
  }
  
  presentActionSheet() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Select Items',
      buttons: [
        {
          text: 'Add to Favorites',
          
          handler: () => {
            this.addToFavorites();
          },
         
        },
        {
          text: 'Add a Comment',
          handler: () => {
            this.addComment();
          },
         
        },
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          },
        
        }
      ]
    });
    actionSheet.present();
  }
  addComment() {
    let modal = this.modalCtrl.create(CommentPage, { dishId : this.dish.id });
    modal.onDidDismiss(comment => {
      this.dish.comments.push(comment);
    })
    modal.present();
  }

}