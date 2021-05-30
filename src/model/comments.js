import Observer from './observer.js';

export default class Films extends Observer {
  constructor() {
    super();

    this._comments = [];
  }


  getComments() {
    return this._comments;
  }

  setComments(comments) {
    this._comments = comments.slice();
  }

  addComment(updateType, update) {
    this._comments = [
      update,
      ...this._comments,
    ];

    this._notify(updateType, update);
  }

  deleteComment(updateType, update) {
    const index = this._comments.findIndex((comment) => comment.id === update.id);
    if (index === -1) {
      throw new Error('Can\'t delete unexisting comment');
    }

    this._comments = [
      ...this._comments.slice(0, index),
      ...this._comments.slice(index + 1),
    ];

    this._notify(updateType, this._comments);
  }

  static adaptToClient(comment) {
    const adaptedComment = Object.assign(
      {},
      comment,
      {
        author: comment.author,
        text: comment.comment,
        date: comment.date,
        emotion: comment.emotion,
        id: comment.id,
      },
    );

    delete adaptedComment.comment;

    return adaptedComment;
  }

  static adaptToServer(comment) {
    const adaptedComment = Object.assign(
      {},
      comment,
      {
        emotion: comment.emoji,
        comment: comment.text,
      },
    );

    delete adaptedComment.emoji;
    delete adaptedComment.text;

    return adaptedComment;
  }
}
