module.exports = async (__, args, cxt) => {
  try {
    const cardId = args.request.cardId;
    const pos = args.request.pos;
    const sectionId = args.request.sectionId;
    const card = await cxt.card.updatePos(cardId, pos, sectionId);

    cxt.publisher.publish(cxt.SUBSCRIPTION_CONSTANTS.ON_CARD_POS_CHANGE, {
      onCardPosChange: card,
    });
    return card;
  } catch (e) {
    console.log("Error => ", e);
    return null;
  }
};
