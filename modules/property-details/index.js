/* eslint-disable max-statements */
import { add, differenceInYears, format } from "date-fns";
import React, { useEffect, useState } from "react";
import { Button } from "../../components/button";
import RowContainer from "../../components/row-container";
import {
  AccountHeadline,
  AccountLabel,
  AccountList,
  AccountListItem,
  AccountSection,
  InfoText,
  Inset,
  InfoSuccessText,
  AccountListItemTable,
  AccountListTable,
} from "./style";

const Detail = ({}) => {
  const [account, setAccunt] = useState([]);
  useEffect(() => {
    window
      .fetch("/api/account")
      .then((res) => res.json())
      .then((res) => {
        setAccunt(res.account);
      });
  }, []);

  let mortgage;
  let annualAppreciation;
  let sincePurchasePercentage;
  let sincePurchase;
  let num_of_years;
  const lastUpdate = new Date(account.lastUpdate);
  if (
    account &&
    account.associatedMortgages &&
    account.associatedMortgages.length
  ) {
    mortgage = account.associatedMortgages[0];
  }

  if (account && account.recentValuation && account.originalPurchasePrice) {
    sincePurchase =
      account.recentValuation.amount - account.originalPurchasePrice;
    sincePurchasePercentage =
      (sincePurchase / account.originalPurchasePrice) * 100;
    num_of_years = differenceInYears(
      new Date(lastUpdate),
      new Date(account.originalPurchasePriceDate)
    );
    annualAppreciation = sincePurchasePercentage / num_of_years;
  }

  return (
    <Inset>
      {account.recentValuation && (
        <AccountSection>
          <AccountLabel>Estimated Value</AccountLabel>
          <AccountHeadline>
            {new Intl.NumberFormat("en-GB", {
              style: "currency",
              currency: "GBP",
            }).format(account.recentValuation.amount)}
          </AccountHeadline>
          <AccountList>
            <AccountListItem>
              <InfoText>
                {`Last updated ${format(lastUpdate, "do MMM yyyy")}`}
              </InfoText>
            </AccountListItem>
            <AccountListItem>
              <InfoText>
                {`Next update ${format(
                  add(lastUpdate, { days: account.updateAfterDays }),
                  "do MMM yyyy"
                )}`}
              </InfoText>
            </AccountListItem>
          </AccountList>
        </AccountSection>
      )}
      <AccountSection>
        <AccountLabel>Property details</AccountLabel>
        <RowContainer>
          <AccountList>
            <AccountListItem>
              <InfoText>{account.name}</InfoText>
            </AccountListItem>
            <AccountListItem>
              <InfoText>{account.bankName}</InfoText>
            </AccountListItem>
            <AccountListItem>
              <InfoText>{account.postcode}</InfoText>
            </AccountListItem>
          </AccountList>
        </RowContainer>
      </AccountSection>
      {account && account.associatedMortgages && (
        <AccountSection>
          <AccountLabel>Mortgage</AccountLabel>
          <RowContainer
            // This is a dummy action
            onClick={() => alert("You have navigated to the mortgage page")}
          >
            <AccountList>
              <AccountListItem>
                <InfoText>
                  {new Intl.NumberFormat("en-GB", {
                    style: "currency",
                    currency: "GBP",
                  }).format(
                    Math.abs(account.associatedMortgages[0].currentBalance)
                  )}
                </InfoText>
              </AccountListItem>
              <AccountListItem>
                <InfoText>{account.associatedMortgages[0].name}</InfoText>
              </AccountListItem>
            </AccountList>
          </RowContainer>
        </AccountSection>
      )}

      {account && account.recentValuation && (
        <AccountSection>
          <AccountLabel>Valuation Changes</AccountLabel>
          <RowContainer>
            <AccountListItem>
              <InfoText>
                {`Purchased for  ${new Intl.NumberFormat("en-GB", {
                  style: "currency",
                  currency: "GBP",
                }).format(Math.abs(sincePurchase))} in ${format(
                  add(lastUpdate, { days: account.dateCreated }),
                  "do MMM yyyy"
                )}`}
              </InfoText>
            </AccountListItem>
          </RowContainer>
          <AccountListTable>
            <AccountListItemTable>
              <InfoText>Since Purchase</InfoText>
            </AccountListItemTable>
            <AccountListItemTable>
              <InfoSuccessText>{` ${new Intl.NumberFormat("en-GB", {
                style: "currency",
                currency: "GBP",
              }).format(
                account.originalPurchasePrice
              )} (${sincePurchasePercentage})%`}</InfoSuccessText>
            </AccountListItemTable>
            <AccountListItemTable>
              <InfoText>Annual appreciation</InfoText>
            </AccountListItemTable>
            <AccountListItemTable>
              <InfoSuccessText>{`${annualAppreciation}%`}</InfoSuccessText>
            </AccountListItemTable>
          </AccountListTable>
        </AccountSection>
      )}
      <Button
        // This is a dummy action
        onClick={() => alert("You have navigated to the edit account page")}
      >
        Edit account
      </Button>
    </Inset>
  );
};

export default Detail;
